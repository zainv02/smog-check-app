import { useNavigate } from '@solidjs/router';
import { Component, JSX, createSignal, onCleanup, onMount, For, createEffect } from 'solid-js';

import { Button, ButtonStyles, LinkButton, SubmitButton } from '$components/Button';
import { Form } from '$components/Form';
import { Title } from '$components/Header';
import { createInvoice, getEstimate } from '$src/backendHook';
import { useErrorState } from '$src/contexts/errorState';
import { useLoadingState } from '$src/contexts/loadingState';
import { useSessionState } from '$src/contexts/sessionState';


type CanvasPosition = [number, number];
type DrawEventHandler = (e: {
    pos: CanvasPosition;
}) => void;

const SignPage: Component = () => {

    const [ submitting, setSubmitting ] = createSignal(false);
    const [ signed, setSigned ] = createSignal(false);
    const [ canvasSize, setCanvasSize ] = createSignal<[number, number]>([ 0, 0 ]);
    const [ fees, setFees ] = createSignal<{label: string, amount: number}[]>([]);
    const [ estimate, setEstimate ] = createSignal<number>(0);

    const { addLoadingPromise }= useLoadingState();
    const { setError } = useErrorState();
    const { valid, session } = useSessionState();
    const navigate = useNavigate();

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let resizeObserver: ResizeObserver;
    
    createEffect(() => {

        let feeTotal = 0;
        fees().forEach(({ amount }) => feeTotal += amount);
        setEstimate(feeTotal);
    
    });

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

    createEffect(() => {

        if (!valid()) {

            return;
        
        }

        addLoadingPromise(getEstimate({ session: session() }), 'Getting estimate').then(result => {

            if (!result) {
            
                console.error('failed to get estimate');
                setError('Failed to get an estimate');
                return;
            
            }
    
            setFees(result as {label: string, amount: number}[]);
        
        });

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

        if (currentPoints.length === 2) {

            ctx.fillRect(currentPoints[ 0 ], currentPoints[ 1 ], 3, 3);
        
        }

        // debug print the signature
        // console.log(`[${lines.map(line => `[${line.join(',')}]`).join(',')}]`);
    
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
            signature: lines
        };

        console.log('using this data:', data);

        const result = await addLoadingPromise(createInvoice({ session: session() }, data), 'Creating invoice');

        if (result) {

            console.log('success with result', result);

            navigate('/invoice' + `?${new URLSearchParams({ session: session() })}`, { replace: true });
        
        } else {

            console.error('failed to create invoice');
            // setSubmitError('Couldn\'t find the requested vehicle information. Check that the license plate and state are correct.');

        }

        setSubmitting(false);
    
    };
    

    return (
        <>
            <Title>Confirm Estimate</Title>
            <Form onSubmit={handleSubmit} class='w-full'>
                <For each={fees()}>{({ label, amount }) => 
                    <div class='flex flex-row items-end justify-between border-b-[1px] border-b-gray-600 pb-1'>
                        <p class='max-w-[70%]'>{label}</p>
                        <p class='text-right'>${amount.toFixed(2)}</p>
                    </div>
                }</For>
                <p class='text-center'>Total:</p>
                <p class='text-center text-4xl'>${estimate().toFixed(2)}</p>
                <p class='text-center'>Sign in the box below:</p>
                <div class='h-20 w-[400px] min-w-[400px] max-w-[400px] rounded outline outline-1 outline-gray-400'>
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
                    <LinkButton href={'/user-info' + `?${new URLSearchParams({ session: session() })}`} replace={true}>Back</LinkButton>
                    <Button disabled={submitting() || !signed()} onClick={e => {

                        e.preventDefault(); handleDrawClear();

                    }}>Reset</Button>
                    <SubmitButton buttonStyle={ButtonStyles.PRIMARY} disabled={submitting() || !signed()}>Confirm</SubmitButton>
                </div>
            </Form>
        </>
    );

};

export default SignPage;