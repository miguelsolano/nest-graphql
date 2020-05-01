import { RequestQueryParser } from '@nestjsx/crud-request';

export class CrudRequestOptions {
    constructor(private readonly queryParams: any) {
        this.queryParams = queryParams;
        this.formatSearchAndFilters();
    }

    getParseQueryParams(): object {
        return this.queryParams;
    }

    getSearch(): object {
        return this.queryParams.search;
    }

    hasLength(val: any): boolean {
        if (val == undefined) {
            return false;
        } else {
            return val.length > 0;
        }
    }

    formatSearchAndFilters(): void {
        let search = {};
        if (this.hasLength(this.queryParams.filter)) {
            this.queryParams.filter = this.queryParams.filter.split('&');
        } else {
            this.queryParams.filter = '';
        }
        if (this.hasLength(this.queryParams.or)) {
            this.queryParams.or = this.queryParams.or.split('&');
        } else {
            this.queryParams.or = '';
        }

        const parser = RequestQueryParser.create();
        parser.parseQuery(this.queryParams);

        if (this.hasLength(this.queryParams.s)) {
            this.queryParams.search = this.queryParams.s;
            return;
        } else if (
            this.hasLength(this.queryParams.filter) &&
            this.hasLength(this.queryParams.or)
        ) {
            search =
                this.queryParams.filter.length === 1 && this.queryParams.or.length === 1
                    ? {
                        $or: [
                            parser.convertFilterToSearch(parser.getParsed().filter[0]),
                            parser.convertFilterToSearch(parser.getParsed().or[0]),
                        ],
                    }
                    : {
                        $or: [
                            {
                                $and: parser.getParsed().filter.map(parser.convertFilterToSearch),
                            },
                            {
                                $and: parser.getParsed().or.map(parser.convertFilterToSearch),
                            },
                        ],
                    };
        } else if (this.hasLength(this.queryParams.filter)) {
            search = {
                $and: parser.getParsed().filter.map(parser.convertFilterToSearch),
            };
        } else {
            if (this.hasLength(this.queryParams.or)) {
                search =
                    this.queryParams.or.length === 1
                        ? { $or: parser.convertFilterToSearch(parser.or[0]) }
                        : {
                            $or: parser.or.map(parser.convertFilterToSearch),
                        };
            }
        }
        this.queryParams.search = search;
    }
}
