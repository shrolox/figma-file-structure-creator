interface FileStructure {
  [key: string]: string[];
}

const FILE_TYPES: FileStructure = {
  "ui": [
    "ℹ️ Read me",
    " ",
    "📚 ZH Documentation",
    "🚹 Accessibility Annotations",
    " ",
    "💎 Style Guide",
    "↳ Specifics Componants",
    " ",
    "🎨 UI - Mock Ups/ Design",
    "↳ 🔴 [Page Name]",
    "↳ 🟢 [Page Name]",
    " ",
    "🔭 Exploration",
    " ",
    "🌄 Cover",
    "📦 Archive"
  ],
  "ux": [
    "ℹ️ Read me",
    " ",
    "🩻 UX - Wireframes",
    "↳ 🔴 [Page Name]",
    "↳ 🟢 [Page Name]",
    " ",
    "🌄 Cover",
    "📦 Archive"
  ]
}

figma.showUI(__html__);

figma.ui.onmessage = msg => {
  // create pages from array
  if (msg.type === 'create-file-structure') {
    createPages(msg.payload.fileType);
    console.log(msg.payload.deleteOtherPages);
    if (msg.payload.deleteOtherPages===true) {
      deleteOtherPages(msg.payload.fileType);
    }
  }

  figma.closePlugin();
};

function deleteOtherPages(fileType: string) {
  const pages = figma.root.children;
  pages.forEach((page: PageNode) => {
    // delete pages that are not in the FILE_TYPES
    if (!FILE_TYPES[fileType].includes(page.name)) {
      // if a page we want to delete is selected, select the last page
      if (page === figma.currentPage) {
        figma.currentPage = figma.root.children[
          figma.root.children.length-2
        ];
      }
      page.remove();
    } 
  })
}

function createPages(fileType: string) {
  // for the matching file type, create pages
  const pages = FILE_TYPES[fileType];
  pages.forEach((pageName: string) => {
    const page = figma.createPage();
    page.name = pageName;
    figma.root.appendChild(page);
  })
}