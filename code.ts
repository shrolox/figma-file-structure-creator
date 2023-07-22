interface FileStructure {
  [key: string]: Page[];
}

interface Component {
  key: string;
  inFrame: boolean;
  useAsThumbnail: boolean;
}

interface Page {
  name: string;
  components: Component[];
}

const TEMPORARY_PAGE_NAME = "               ";

const FILE_TYPES: FileStructure = {
  "ui": [
    {name: "ℹ️ Read me", components: []},
    {name: " ", components: []},
    {name: "📚 ZH Documentation", components: []},
    {name: "🚹 Accessibility Annotations", components: []},
    {name: " ", components: []},
    {name: "💎 Style Guide", components: []},
    {name: "↳ Specifics Componants", components: []},
    {name: " ", components: []},
    {name: "🎨 UI - Mock Ups/ Design", components: []},
    {name: "↳ 🔴 [Page Name]", components: []},
    {name: "↳ 🟢 [Page Name]", components: []},
    {name: " ", components: []},
    {name: "🔭 Exploration", components: [{key: "68c73e3ed43358ff7da44e6c7d88f666b0f2062e", inFrame: true, useAsThumbnail: false}]},
    {name: " ", components: []},
    {name: "🌄 Cover", components: [
      {key: "f7d5039c12c535a4b441b1ab0ddc21dd1a758017", inFrame: true, useAsThumbnail: true}
    ]},
    {name: "📦 Archive", components: []}
  ],
  "ux": [
    {name: "ℹ️ Read me", components: []},
    {name: " ", components: []},
    {name: "🩻 UX - Wireframes", components: []},
    {name: "↳ 🔴 [Page Name]", components: []},
    {name: "↳ 🟢 [Page Name]", components: []},
    {name: " ", components: []},
    {name: "🌄 Cover", components: [
      {key: "68c73e3ed43358ff7da44e6c7d88f666b0f2062e", inFrame: true, useAsThumbnail: true}
    ]},
    {name: "📦 Archive", components: []}
  ]
}

figma.showUI(__html__);

figma.ui.onmessage = msg => {
  // create pages from array
  if (msg.type === 'create-file-structure') {
    createTemporaryPage();
    if (msg.payload.deleteOtherPages===true) {
      deleteOtherPages(msg.payload.fileType);
    }
    createPages(msg.payload.fileType);
    selectPage();
    deleteTemporaryPage();
  }
};

function deleteOtherPages(fileType: string) {
  const pages = figma.root.children;
  pages.forEach((page: PageNode) => {
    // delete all pages except the temporary page
    if (page.name !== TEMPORARY_PAGE_NAME) {
      page.remove();
    } 
  })
}

function createPages(fileType: string) {
  // for the matching file type, create pages
  const pages = FILE_TYPES[fileType];
  pages.forEach((pageStruct: Page) => {
    const page = figma.createPage();
    page.name = pageStruct.name;
    // create components
    pageStruct.components.forEach((component: Component) => {
      figma.importComponentByKeyAsync(component.key).then((node) => {
        // create a frame and append the component to it
        const frame = figma.createFrame();
        const componentInstance = node.createInstance();

        if (component.inFrame) {
          frame.resize(componentInstance.width, componentInstance.height);
          frame.appendChild(componentInstance);

          page.appendChild(frame);
          if (component.useAsThumbnail) {
            frame.name = page.name;
            figma.setFileThumbnailNodeAsync(frame);
          }
        } else {
          page.appendChild(componentInstance);
        }
      }).catch((err) => {
        console.log("component not found", err);
      })
    })

    figma.root.appendChild(page);
  })
}

function createTemporaryPage() {
  const page = figma.createPage();
  page.name = TEMPORARY_PAGE_NAME;
  figma.root.appendChild(page);
  figma.currentPage =
   page;
}

function deleteTemporaryPage() {
  // find the temporary page and delete it
  const pages = figma.root.children;
  pages.forEach((page: PageNode) => {
    if (page.name === TEMPORARY_PAGE_NAME) {
      page.remove();
    } 
  })
}

function selectPage() {
  // select the last page of the document
  const pages = figma.root.children;
  const lastPage = pages[pages.length - 2];
  figma.currentPage = lastPage;
}