import crypto from 'node:crypto';

type OnFreeHandler<TData> = (data: TData) => (boolean | Promise<boolean>)

export class Session<TData> {
    
    private _id: string;
    private _manager: SessionManager<TData>;
    private _alive: boolean = true;
    private _onFree?: OnFreeHandler<TData>;

    public data: TData;
    
    constructor(manager: SessionManager<TData>, data: TData, opts?: {onFree?: OnFreeHandler<TData>, id?: string}) {

        this._manager = manager;
        this.data = data;
        this._onFree = opts && opts.onFree;
        this._id = opts?.id || crypto.randomUUID();
    
    }

    getId() {

        return this._id;
    
    }

    /**
     * Checks if the session is alive or has been freed
     * @returns true if the session has not been freed, otherwise false
     */
    isAlive(): boolean {

        return this._alive;
    
    }

    async free(): Promise<boolean> {

        if (!this._alive) {

            console.warn(`Session [${this._id}] warning - already freed`);
            return false;
        
        }

        if (this._onFree) {

            try {

                if (!(await Promise.resolve(this._onFree(this.data)))) {

                    console.warn(`Session [${this._id}] warning - on free handler failed`, this.data);
                    return false;
                
                }
            
            } catch (error) {
                
                console.error(`Session [${this._id}] error - failed to free`, this.data);
                return false;

            }
        
        }

        this._alive = false;


        return this._manager.freeSession(this._id);
    
    }

}


type InitialDataConstructor<TData> = () => (TData | Promise<TData>);

export class SessionManager<TData> {

    private _sessions = new Map<string, Session<TData>>();

    private _initialDataConstructor: InitialDataConstructor<TData>;

    constructor(initialDataConstructor: InitialDataConstructor<TData>) {

        this._initialDataConstructor = initialDataConstructor;
    
    }

    /**
     * Creates a new session with a random uuid
     * @param initialData OPTIONAL: the initial data for the session. If undefined, the initialDataConstructor will be used to generate data
     * @returns a new session
     */
    async createSession(initialData?: TData): Promise<Session<TData>> {

        if (initialData === undefined) {

            initialData = await Promise.resolve(this._initialDataConstructor());
        
        }

        const session = new Session<TData>(this, initialData);
        this._sessions.set(session.getId(), session);
        return session;
    
    }

    getSession(id: string): Session<TData> | undefined {

        return this._sessions.get(id);
    
    }

    /**
     * Frees a session
     * @param id the session id
     * @returns true if the session was freed otherwise false if the session was not freed or did not exist
     */
    async freeSession(id: string): Promise<boolean> {

        const session = this._sessions.get(id);
        if (session) {

            if (session.isAlive()) {

                return session.free();
            
            }

            this._sessions.delete(id);
            return true;
        
        }
        return false;
    
    }

    /**
     * Frees all sessions
     * @returns true if sessions were freed, otherwise false if there was nothing to free
     */
    async freeAllSessions(): Promise<boolean> {

        let anyFreed = false;
        for (const id of this._sessions.keys()) {

            if (await this.freeSession(id)) {

                anyFreed = true;
            
            }
        
        }

        return anyFreed;
    
    }

}