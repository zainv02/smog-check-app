import { useSearchParams } from '@solidjs/router';
// import base64 from 'base-64';
// import PDFObject from 'pdfobject';
import { Component, JSX, createSignal, onCleanup, onMount } from 'solid-js';
// import utf8 from 'utf8';

import { Button, ButtonStyles, SubmitButton } from '$components/Button';
import { Form } from '$components/Form';
import { Title } from '$components/Header';
import { Panel, Section } from '$components/Layout';
import { LoadingDisplay } from '$components/LoadingDisplay';
import { getInvoice } from '$src/backendHook';


type CanvasPosition = [number, number];
type DrawEventHandler = (e: {
    pos: CanvasPosition;
}) => void;

const SignPage: Component = () => {

    const [ submitting, setSubmitting ] = createSignal(false);
    const [ signed, setSigned ] = createSignal(false);
    const [ canvasSize, setCanvasSize ] = createSignal<[number, number]>([ 0, 0 ]);
    const [ searchParams ] = useSearchParams();
    // const [ pdfSrc, setPdfSrc ] = createSignal('');

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let resizeObserver: ResizeObserver;

    onMount(() => {

        resizeObserver = new ResizeObserver((entries) => {

            for (const entry of entries) {

                if (entry.contentRect) {

                    setCanvasSize([
                        entry.contentRect.width,
                        entry.contentRect.height
                    ]);
                
                }
            
            }
            
        
        });
        resizeObserver.observe(canvas);

        ctx = canvas.getContext('2d');

        window.addEventListener('touchend', handleDrawEnd);
        window.addEventListener('mouseup', handleDrawEnd);
    
    });

    onCleanup(() => {

        resizeObserver.disconnect();

        window.removeEventListener('touchend', handleDrawEnd);
        window.removeEventListener('mouseup', handleDrawEnd);
    
    });

    const distanceSquared: (x1: number, y1: number, x2: number, y2: number) => number = (x1, y1, x2, y2) => {

        const xDif = x2 - x1;
        const yDif = y2 - y1;
        return xDif * xDif + yDif * yDif;
        
    };

    const [ drawing, setDrawing ] = createSignal<boolean>(false);

    let lines: number[][] = [];
    let currentPoints: number[] = [];

    let prevPos: CanvasPosition = [ 0, 0 ];


    const handleDrawStart: DrawEventHandler = (e) => {

        prevPos = e.pos;
        currentPoints = [ ...e.pos ];
        ctx.fillRect(...e.pos, 3, 3);
        ctx.lineWidth = 1;
        setDrawing(true);
    
    };

    const handleDrawMove: DrawEventHandler = (e) => {

        if (!drawing()){

            return;
        
        }

        // this is to prevent too many points. it might be unnecessary
        // another addition could be to check for the angle that it is similar, to combine long lines
        if (distanceSquared(...prevPos, ...e.pos) < 10) {

            return;
        
        }
        
        ctx.beginPath();
        ctx.moveTo(...prevPos);
        ctx.lineTo(...e.pos);
        ctx.stroke();

        currentPoints.push(...e.pos);

        prevPos = e.pos;
    
    };

    const handleDrawEnd = () => {
        
        if (!drawing()) {

            return;
        
        }
        setDrawing(false);
        setSigned(true);
        lines.push(currentPoints);
    
    };

    const handleDrawClear = () => {

        setSigned(false);
        ctx.clearRect(0, 0, ...canvasSize());
        lines = [];

    };

    const handleSubmit: JSX.HTMLElementTags['form']['onSubmit'] = async (e) => {

        e.preventDefault();

        if (submitting()) {

            return;
        
        }

        setSubmitting(true);

        console.log('submitting and generating invoice');

        // console.log(lines.map(line => `[${line.toString()}]`).join(','), canvasSize());

        const data = {
            name: searchParams[ 'name' ],
            address: searchParams[ 'address' ],
            phone: searchParams[ 'phone' ],
            city: searchParams[ 'city' ],
            source: searchParams[ 'source' ],
            vin: searchParams[ 'vin' ],
            year: searchParams[ 'year' ],
            make: searchParams[ 'make' ],
            model: searchParams[ 'model' ],
            plate: searchParams[ 'plate' ],
            mileage: searchParams[ 'mileage' ],
            date: searchParams[ 'date' ],
            estimate: 145.2,
            signature: lines
        };

        console.log('using this data:', data);

        const result = await getInvoice(data);

        if (result) {

            console.log('success with result', result);

            // const dataUrl = `data:application/pdf;filename=invoice.pdf;base64,${base64.encode(utf8.encode(result))}`;

            // tested btoa(unescape(encodeURIComponent(result))) and it works, but unescape is deprecated, so trying to replace
            // setPdfSrc(dataUrl);
            // PDFObject.embed(dataUrl, '#pdfobject');

            // navigate('/user-info' + `?${new URLSearchParams(result)}`);
        
        } else {

            console.error('failed to get invoice');
            // setSubmitError('Couldn\'t find the requested vehicle information. Check that the license plate and state are correct.');

        }

        setSubmitting(false);
    
    };
    

    return (
        <Section>
            <Panel class='relative'>
                <Title>Confirm Estimate</Title>
                <Form onSubmit={handleSubmit} class='w-full'>
                    <p class='text-center text-4xl'>${Number.parseFloat(`${200}`).toFixed(2)}</p>
                    <p class='text-center'>Sign in the box below:</p>
                    <div class='h-20 w-full rounded outline outline-1 outline-gray-400'>
                        <canvas 
                            ref={canvas} 
                            class='h-full w-full touch-none select-none' 
                            width={canvasSize()[ 0 ]} 
                            height={canvasSize()[ 1 ]}
                            onTouchStart={e => {

                                const rect = e.currentTarget.getBoundingClientRect();
                                handleDrawStart({ pos: [ e.touches[ 0 ].clientX - rect.left, e.touches[ 0 ].clientY - rect.top ] });

                            }}
                            onTouchMove={e => {

                                const rect = e.currentTarget.getBoundingClientRect();
                                handleDrawMove({ pos: [ e.touches[ 0 ].clientX - rect.left, e.touches[ 0 ].clientY - rect.top ] });
                        
                            }}
                            onTouchEnd={() => {

                                handleDrawEnd();

                            }}
                            onMouseDown={e => {

                                handleDrawStart({ pos: [ e.offsetX, e.offsetY ] });
                            
                            }}
                            onMouseMove={e => {

                                handleDrawMove({ pos: [ e.offsetX, e.offsetY ] });
                            
                            }}
                            onMouseUp={() => {

                                handleDrawEnd();
                            
                            }}
                        />
                    </div>
                    <div class='flex flex-row items-center justify-between'>
                        <Button disabled={submitting()} onClick={e => {

                            e.preventDefault(); history.back();

                        }}>Back</Button>
                        <Button disabled={submitting() || !signed()} onClick={e => {

                            e.preventDefault(); handleDrawClear();

                        }}>Reset</Button>
                        <SubmitButton buttonStyle={ButtonStyles.PRIMARY} disabled={submitting() || !signed()}>Confirm</SubmitButton>
                    </div>
                </Form>
                {submitting() && <LoadingDisplay />}
            </Panel>
            {/* <div id='pdfobject' class='h-[400px] w-[500px]' /> */}
            {/* <embed src={pdfSrc()} type='application/pdf' width={500} height={400} class='outline outline-red-500' /> */}
        </Section>
    );

};

export default SignPage;