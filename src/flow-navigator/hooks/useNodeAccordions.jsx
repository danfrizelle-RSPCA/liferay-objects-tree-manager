import { useEffect, useRef, useState } from "react";

/* Hook: useNodeAccordions
Purpose: fetch + cache accordion data per node id for the navigator.

- Maintains a cache: nodeId -> normalized accordion array
- On currentNodeId change, fetches accordions once per node (unless already cached)
- Uses a request id ref to ignore stale async responses during rapid navigation

Returns:
- accordionsByNodeId: object map of nodeId -> accordion array
- isLoadingNodeId: nodeId currently being fetched (or null)
- getAccordionsForNode: helper to safely read cache
*/

export const useNodeAccordions = (accordionService, currentNodeId) => {
  const [accordionsByNodeId, setAccordionsByNodeId] = useState({});
  const [isLoadingNodeId, setIsLoadingNodeId] = useState(null);

  const accordionRequestIdRef = useRef(0);

  useEffect(() => {
    if (!currentNodeId) return;
    if (!accordionService) return;

    // If we already fetched this node (including "no results"), do nothing.
    if (accordionsByNodeId[currentNodeId] !== undefined) return;

    const requestId = ++accordionRequestIdRef.current;
    setIsLoadingNodeId(currentNodeId);

    accordionService
      .getAccordions(currentNodeId)
      .then((accordions) => {
        if (accordionRequestIdRef.current !== requestId) return;

        setAccordionsByNodeId((prev) => ({
          ...prev,
          [currentNodeId]: accordions,
        }));
      })
      .catch((error) => {
        if (accordionRequestIdRef.current !== requestId) return;

        console.log(
          `No accordions found for node ${currentNodeId}:`,
          error?.message
        );

        setAccordionsByNodeId((prev) => ({
          ...prev,
          [currentNodeId]: [],
        }));
      })
      .finally(() => {
        if (accordionRequestIdRef.current !== requestId) return;
        setIsLoadingNodeId(null);
      });
  }, [currentNodeId, accordionsByNodeId, accordionService]);

  const getAccordionsForNode = (nodeId) => {
    if (!nodeId) return undefined;
    return accordionsByNodeId[nodeId];
  };

  return { accordionsByNodeId, isLoadingNodeId, getAccordionsForNode };
};
