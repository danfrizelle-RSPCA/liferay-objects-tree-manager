<graph-editor
    portal-base-url="${themeDisplay.getPortalURL()}/o/c/"
    edge-dpt-base-url="/web/trees/e/edge-edition-dpt/42492/"
    node-dpt-base-url="/web/trees/e/node-edition-dpt/42493/"
>
	<tree object-name="tree" object-name-plural="trees" label="name" node-belongs-relationship="nodeBelongs" edge-belongs-relationship="edgeBelongs" />
	<node object-name="node" object-name-plural="nodes" label="name" text="description" root="root" x="xCoordinates" y="yCoordinates" />
	<edge object-name="edge" object-name-plural="edges" label="name" source-relationship="source" target-relationship="target" />
</graph-editor>