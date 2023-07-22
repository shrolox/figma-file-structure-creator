"use strict";
const FILE_TYPES = {
    "ui": [
        { name: "ℹ️ Read me", components: [] },
        { name: " ", components: [] },
        { name: "📚 ZH Documentation", components: [] },
        { name: "🚹 Accessibility Annotations", components: [] },
        { name: " ", components: [] },
        { name: "💎 Style Guide", components: [] },
        { name: "↳ Specifics Componants", components: [] },
        { name: " ", components: [] },
        { name: "🎨 UI - Mock Ups/ Design", components: [] },
        { name: "↳ 🔴 [Page Name]", components: [] },
        { name: "↳ 🟢 [Page Name]", components: [] },
        { name: " ", components: [] },
        { name: "🔭 Exploration", components: [{ key: "68c73e3ed43358ff7da44e6c7d88f666b0f2062e", inFrame: true, useAsThumbnail: false }] },
        { name: " ", components: [] },
        { name: "🌄 Cover", components: [
                { key: "f7d5039c12c535a4b441b1ab0ddc21dd1a758017", inFrame: true, useAsThumbnail: true }
            ] },
        { name: "📦 Archive", components: [] }
    ],
    "ux": [
        { name: "ℹ️ Read me", components: [] },
        { name: " ", components: [] },
        { name: "🩻 UX - Wireframes", components: [] },
        { name: "↳ 🔴 [Page Name]", components: [] },
        { name: "↳ 🟢 [Page Name]", components: [] },
        { name: " ", components: [] },
        { name: "🌄 Cover", components: [
                { key: "68c73e3ed43358ff7da44e6c7d88f666b0f2062e", inFrame: true, useAsThumbnail: true }
            ] },
        { name: "📦 Archive", components: [] }
    ]
};
figma.showUI(__html__);
figma.ui.onmessage = msg => {
    // create pages from array
    if (msg.type === 'create-file-structure') {
        createPages(msg.payload.fileType);
        console.log(msg.payload.deleteOtherPages);
        if (msg.payload.deleteOtherPages === true) {
            deleteOtherPages(msg.payload.fileType);
        }
    }
};
function deleteOtherPages(fileType) {
    const pages = figma.root.children;
    pages.forEach((page) => {
        // delete pages that are not in the FILE_TYPES
        const pageNames = FILE_TYPES[fileType].map((p) => p.name);
        if (!pageNames.includes(page.name)) {
            // if a page we want to delete is selected, select the last page
            if (page === figma.currentPage) {
                figma.currentPage = figma.root.children[figma.root.children.length - 2];
            }
            page.remove();
        }
    });
}
function createPages(fileType) {
    // for the matching file type, create pages
    const pages = FILE_TYPES[fileType];
    pages.forEach((pageStruct) => {
        const page = figma.createPage();
        page.name = pageStruct.name;
        // create components
        pageStruct.components.forEach((component) => {
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
                }
                else {
                    page.appendChild(componentInstance);
                }
            }).catch((err) => {
                console.log("component not found", err);
            });
        });
        figma.root.appendChild(page);
    });
}
