export namespace analyzer {
	
	export class Entry {
	    name: string;
	    count: number;
	
	    static createFrom(source: any = {}) {
	        return new Entry(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.count = source["count"];
	    }
	}
	export class Metrics {
	    nu1: number;
	    nu2: number;
	    n1: number;
	    n2: number;
	    nu: number;
	    N: number;
	    V: number;
	
	    static createFrom(source: any = {}) {
	        return new Metrics(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.nu1 = source["nu1"];
	        this.nu2 = source["nu2"];
	        this.n1 = source["n1"];
	        this.n2 = source["n2"];
	        this.nu = source["nu"];
	        this.N = source["N"];
	        this.V = source["V"];
	    }
	}
	export class Result {
	    operators: Entry[];
	    operands: Entry[];
	    metrics: Metrics;
	
	    static createFrom(source: any = {}) {
	        return new Result(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.operators = this.convertValues(source["operators"], Entry);
	        this.operands = this.convertValues(source["operands"], Entry);
	        this.metrics = this.convertValues(source["metrics"], Metrics);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

