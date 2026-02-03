# Liferay Objects Tree Manager (Client Extension)

This client extension provides **two web components** backed by React:

- `<graph-editor>`: build and edit decision-tree-like flows (nodes + edges) with a visual canvas
- `<graph-navigator>`: browse a tree as an end-user decision experience (DecisionScreen)

The runtime is designed for Liferay Object APIs (Headless) and is configured via HTML/FTL attributes.

---

## Quick start (local dev)

Prereqs:
- Node.js + Yarn

Commands:

```bash
yarn install
yarn dev
```

Then open the local `index.html` page served by Vite.

Build output:

```bash
yarn build
```

---

## High-level architecture

### Entry point

Two separate entrypoints register the custom elements:

- `src/graph-editor-index.jsx` → registers `<graph-editor>` and renders `src/editor/GraphEditor.jsx`
- `src/graph-navigator-index.jsx` → registers `<graph-navigator>` and renders `src/navigator/GraphNavigator.jsx`

Both web components:

1. Read configuration from child tags (`<tree/>`, `<node/>`, `<edge/>`) and element attributes.
2. Instantiate service classes under `src/services/`.
3. Pass services into React components via props.

### Services

All API calls go through `src/services/ApiService.js`, which delegates to `window.Liferay.Util.fetch`.

Core domain services:

- `TreeService`: list/resolve/create/delete trees
- `NodeService`: list/create/update/delete nodes (and mark a start/root node)
- `EdgeService`: list/create/update/delete edges
- `AccordionService`: fetch/create/update/delete node-associated accordions

### Two flows

#### 1) Editor flow (`GraphEditor`)

`GraphEditor` uses `@xyflow/react` (React Flow) to render a canvas with:

- custom nodes (`src/editor/flow/CustomNode.jsx`)
- custom edges (`src/editor/flow/CustomEdge.jsx`)

It composes hooks from `src/editor/hooks/` for all editing actions:

- `useTreeData` / `useTreeSelection` / `useTreeCreation` / `useTreeDeletion`
- `useGraphData` (loads nodes+edges into React Flow state)
- `useNodeCreation` / `useNodeUpdate`
- `useEdgeCreation` / `useEdgeUpdate`

UI actions are handled via Clay modals in `src/editor/modals/`:

- tree: `TreeSelectionModal`, `TreeCreationModal`, `TreeDeletionModal`
- node: `NodeCreationModal`, `NodeUpdateModal`
- edge: `EdgeCreationModal`, `EdgeEditionModal`

The node edit modal (`NodeUpdateModal`) also manages accordion CRUD via `AccordionService`.

#### 2) Navigator flow (`GraphNavigator`)

`GraphNavigator` is a read-only experience:

- loads the tree by `tree-erc`
- loads nodes + edges
- shows a `DecisionScreen` for the current node
- maintains history to support Back navigation

Accordion fetch behavior:

- Nodes/edges load first so navigation renders quickly.
- Accordion data is fetched **only when navigating to a node**, cached in-memory, and passed to `DecisionScreen`.

---

## Configuration (HTML/FTL)

Both web components are configured using the same 3 child tags:

- `<tree ... />`
- `<node ... />`
- `<edge ... />`

Example (navigator):

```html
<graph-navigator
  portal-base-url="${themeDisplay.getPortalURL()}/o/c/"
  tree-erc="..."
  edge-dpt-base-url="/web/.../e/.../"
  node-dpt-base-url="/web/.../e/.../"
>
  <tree
    object-name="tree"
    object-name-plural="trees"
    label="name"
    node-belongs-relationship="nodeBelongs"
    edge-belongs-relationship="edgeBelongs"
  />
  <node
    object-name="node"
    object-name-plural="nodes"
    label="name"
    text="description"
    image="image"
    root="root"
    x="xCoordinates"
    y="yCoordinates"
  />
  <edge
    object-name="edge"
    object-name-plural="edges"
    label="name"
    source-relationship="source"
    target-relationship="target"
  />
</graph-navigator>
```

Important attributes:

- `portal-base-url`: base for Liferay Object APIs, typically `.../o/c/`
- `tree-erc` (navigator only): external reference code to resolve the tree id
- `edge-dpt-base-url` / `node-dpt-base-url`: used to build pop-up (DPT) URLs in modals

How relationship ids are derived (in `src/graph-editor-index.jsx` / `src/graph-navigator-index.jsx`):

- edge source/target ids:
  - `r_{source-relationship}_c_{nodeObjectName}Id`
  - `r_{target-relationship}_c_{nodeObjectName}Id`
- tree→node relationship id:
  - `r_{node-belongs-relationship}_c_{treeObjectName}Id`
- tree→edge relationship id:
  - `r_{edge-belongs-relationship}_c_{treeObjectName}Id`

---

## Data models (UI-side)

### Node (navigator)

A node object in `GraphNavigator` state is normalized to:

```js
{
  id: "<nodeId>",
  nodeTitle: "...",
  nodeText: "...",
  nodeImage: {...} | null,
  nodeRoot: true|false
}
```

### Edge (navigator)

```js
{
  id: "<edgeId>",
  source: "<sourceNodeId>",
  target: "<targetNodeId>",
  label: "..."
}
```

### Accordion (normalized)

`AccordionService.getAccordions()` returns:

```js
{
  id: <number>,
  accordionHeading: "...",
  accordionContent: "..."
}
```

---

## Endpoints used

All endpoints are built from `portal-base-url` (typically `.../o/c/`). Object names, relationship names, and field names come from the component configuration.

### Cloud engineer handoff (examples)

- Base prefix: `{portalBaseUrl}/o/c/` where `portalBaseUrl` is the portal origin (example local dev: `http://localhost:8080`)
- Example object/relationship names from the sample markup:
  - `treeObjectNamePlural = trees`
  - `treeLabel = label`
  - `treeNodesRelationshipName = nodeBelongs`
  - `treeEdgesRelationshipName = edgeBelongs`
  - `nodeObjectNamePlural = nodes`
  - `edgeObjectNamePlural = edges`
  - `treeERC = 6442d65a-0e44-fc4a-90b3-69bbc99186e9`

Concrete examples with those values:

- `GET  {base}trees/?fields=id,label`
- `GET  {base}trees/by-external-reference-code/6442d65a-0e44-fc4a-90b3-69bbc99186e9/?fields=id`
- `GET  {base}trees/{treeId}/nodeBelongs/?pageSize=500&fields=...`
- `GET  {base}trees/{treeId}/edgeBelongs/?pageSize=500&fields=...`
- `POST {base}nodes`
- `POST {base}edges/`
- `GET  {base}nodes/{nodeId}/accordion?pageSize=200&fields=id,heading,content`
- `POST {base}accordions`

### Trees (`TreeService`)

- `GET {base}trees/?fields=id,{treeLabelField}`
- `GET {base}trees/by-external-reference-code/{treeERC}/?fields=id`
- `POST {base}trees`
- `DELETE {base}trees/{treeId}`

### Nodes (`NodeService`)

- `GET {base}trees/{treeId}/{nodeBelongsRelationship}/?fields=id,{rootField}`
- `GET {base}trees/{treeId}/{nodeBelongsRelationship}/?pageSize=500&fields=id,{rootField},{labelField},{textField},{imageField},{xField},{yField}`
- `POST {base}nodes`
- `PATCH {base}nodes/{nodeId}`
- `GET {base}nodes/{nodeId}?fields=id,{treeNodeRelationshipIdField}`
- `DELETE {base}nodes/{nodeId}`

### Edges (`EdgeService`)

- `GET {base}trees/{treeId}/{edgeBelongsRelationship}/?pageSize=500&fields=id,{edgeLabelField},{targetRelIdField},{sourceRelIdField}`
- `POST {base}edges/`
- `PATCH {base}edges/{edgeId}`
- `DELETE {base}edges/{edgeId}`

### Accordions (`AccordionService`)

- `GET {base}nodes/{nodeId}/accordion?pageSize=200&fields=id,heading,content`
- `POST {base}accordions`
- `PUT {base}accordions/{accordionId}`
- `DELETE {base}accordions/{accordionId}`

### DPT popup URLs (not headless APIs)

- node: `{node-dpt-base-url}{nodeId}?p_p_state=pop_up`
- edge: `{edge-dpt-base-url}{edgeId}?p_p_state=pop_up`

---

## Folder map (src/)

- `src/graph-editor-index.jsx`: defines `<graph-editor>` web component and wires configuration → services → React
- `src/graph-navigator-index.jsx`: defines `<graph-navigator>` web component and wires configuration → services → React
- `src/editor/`: editor-only UI (React Flow) + modals + hooks + custom node/edge renderers
  - `src/editor/GraphEditor.jsx`: editor canvas UI (React Flow) + modal orchestration
  - `src/editor/hooks/`: composable editor behaviors (tree/node/edge CRUD)
  - `src/editor/modals/`: Clay modal UIs used by the editor
  - `src/editor/flow/`: `CustomNode` / `CustomEdge` renderers
- `src/navigator/`: read-only navigator UI + hooks
  - `src/navigator/GraphNavigator.jsx`: decision navigator + per-node accordion fetch cache
  - `src/navigator/components/DecisionScreen.jsx`: renders current node + answer options; shows accordions on leaf nodes
  - `src/navigator/hooks/`: browse graph data loader + scrolling helpers
- `src/shared/`: shared UI used by both editor + navigator
  - `src/shared/modals/LoadingModal.jsx`: loading spinner modal
- `src/shared/components/`: shared UI components (accordion rendering + shared form building blocks)
- `src/shared/hooks/`: shared hooks (e.g., CKEditor config)
- `src/services/`: API wrappers
- `src/editor/utils/layoutUtils.js`: editor-only auto-layout helpers

---

## Notes / gotchas

- `ApiService` relies on `window.Liferay.Util.fetch`. In local dev, ensure your environment provides it (your dev setup likely shims it).
- Field names differ between fragments (`label/body/image` vs `name/description`). Make sure the markup matches your Liferay object schema.
- Accordion loads can be heavy if `content` is large; the code requests only `id,heading,content`, but the payload size is still driven by your stored HTML.
- Non-API URLs: images may load from `node.nodeImage.link.href`, and some shared components embed YouTube (`https://www.youtube.com/embed/...`) or open external links via `window.open()`.
