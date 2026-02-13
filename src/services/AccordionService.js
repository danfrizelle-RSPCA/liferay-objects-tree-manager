import ApiService from './ApiService';
/* AccordionService: encapsulates CRUD operations for accordion objects.

Constructor takes a set of field/object names so the same class can be reused for different Liferay object schemas.
Example usage (from `src/flow-editor-index.jsx` / `src/flow-navigator-index.jsx`):
new AccordionService(portalBaseUrl, accordionObjectNamePlural, nodeObjectNamePlural, nodeAccordionsId, accordionHeading, accordionContent) */
class AccordionService {

    //localhost:8080/o/c/nodes/42600/accordions/?pageSize=500&fields=id,heading,content
    constructor(baseURL, nodeObjectNamePlural, accordionObjectName, accordionObjectNamePlural, nodeAccordionsId, accordionHeading, accordionContent) {
        this.baseURL = baseURL;
        this.nodeObjectNamePlural = nodeObjectNamePlural;
        this.accordionObjectName = accordionObjectName;
        this.accordionObjectNamePlural = accordionObjectNamePlural;
        this.nodeAccordionsId = nodeAccordionsId;
        this.accordionHeading = accordionHeading;
        this.accordionContent = accordionContent;
    }

    // getAccordions: fetch accordions for a given node id and map fields into a normalized shape used by the UI (including position fields).
    getAccordions(nodeId) {
        // Preferred node-specific endpoint: /nodes/{nodeId}/accordion
        // Request only the needed fields when the endpoint supports it (common for Liferay object APIs).
        const fields = [
            'id',
            this.accordionHeading,
            this.accordionContent
        ].filter(Boolean).join(',');

        const query = `?pageSize=200&fields=${encodeURIComponent(fields)}`;
        const url = this.baseURL + this.nodeObjectNamePlural + "/" + nodeId + "/" + this.accordionObjectName + query;

        const timeLabel = `AccordionService.getAccordions(${nodeId})`;
        try {
            console.time(timeLabel);
        } catch (e) {
            // ignore in environments without console.time
        }

        console.log('AccordionService.getAccordions URL:', url);
        return ApiService.makeCall(url, "GET").then(data => {
            // data might be array or object with items
            let items = [];
            if (Array.isArray(data)) items = data;
            else if (data && data.items) items = data.items;
            else if (data) items = [data];

            try {
                console.log(`AccordionService.getAccordions raw item count for node ${nodeId}:`, items.length);
            } catch (e) {
                // ignore
            }

            return items.map(item => ({
                id: item.id,
                accordionHeading: item[this.accordionHeading] || item.heading || item.title,
                accordionContent: item[this.accordionContent] || item.content || item.body
            }));
        }).finally(() => {
            try {
                console.timeEnd(timeLabel);
            } catch (e) {
                // ignore
            }
        });

    }

    createAccordion(nodeId, accordionHeading, accordionContent) {
        // POST to root /accordions endpoint with relationship field; Liferay API does not support POST to /nodes/{nodeId}/accordion
        const url = this.baseURL + this.accordionObjectNamePlural;
        const body = {
            [this.nodeAccordionsId]: nodeId,
            [this.accordionHeading]: accordionHeading,
            [this.accordionContent]: accordionContent
        };
        console.log('AccordionService.createAccordion URL:', url, 'Body:', body);
        return ApiService.makeCall(url, "POST", body).then(data => {
            return {
                id: data.id,
                accordionHeading: data[this.accordionHeading] || data.heading || data.title,
                accordionContent: data[this.accordionContent] || data.content || data.body
            }
        });

    }

    updateAccordion(accordionId, accordionHeading, accordionContent) {
        // Use PUT on the root /accordions/{id} endpoint
        const url = this.baseURL + this.accordionObjectNamePlural + "/" + accordionId;
        const body = {
            [this.accordionHeading]: accordionHeading,
            [this.accordionContent]: accordionContent
        };
        console.log('AccordionService.updateAccordion URL:', url);
        return ApiService.makeCall(url, "PUT", body);

    }

    deleteAccordion(accordionId) {
        // Use DELETE on the root /accordions/{id} endpoint
        const url = this.baseURL + this.accordionObjectNamePlural + "/" + accordionId;
        console.log('AccordionService.deleteAccordion URL:', url);
        return ApiService.makeCall(url, "DELETE");

    }

}

export default AccordionService;