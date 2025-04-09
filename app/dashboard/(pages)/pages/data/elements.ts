// elements.js
export const basicElements = {
  heading: {
    label: "Heading",
    category: "Basic Elements",
    content: '<h2 class="display-5">Your Heading Here</h2>',
    media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3,4H5V10H9V4H11V16H9V11H5V16H3V4M14,10V16H12V4H14V9H18V4H20V16H18V11H14V10Z"/></svg>`,
  },
  paragraph: {
    label: "Paragraph",
    category: "Basic Elements",
    content: '<p class="lead">Enter your paragraph text here.</p>',
    media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M5,4H19A2,2 0 0,1 21,6V18A2,2 0 0,1 19,20H5A2,2 0 0,1 3,18V6A2,2 0 0,1 5,4M5,6V8H19V6H5M5,10V12H19V10H5M5,14V16H14V14H5Z"/></svg>`,
  },
  button: {
    label: "Button",
    category: "Basic Elements",
    content: {
      tagName: "a",
      attributes: { class: "btn btn-primary", href: "#" },
      content: "Click Me",
      style: { padding: "10px 20px", display: "inline-block" },
    },
    media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M20 2H4C2.9 2 2 2.9 2 4V20C2 21.1 2.9 22 4 22H20C21.1 22 22 21.1 22 20V4C22 2.9 21.1 2 20 2M12 18C9.24 18 7 15.76 7 13S9.24 8 12 8 17 10.24 17 13 14.76 18 12 18M12 10C10.35 10 9 11.35 9 13S10.35 16 12 16 15 14.65 15 13 13.65 10 12 10Z"/></svg>`,
  },
  image: {
    label: "Image",
    category: "Basic Elements",
    content: { type: "image", style: { color: "black" }, activeOnRender: 1 },
    media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19,19H5V5H19M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M13.96,12.29L11.21,15.83L9.25,13.47L6.5,17H17.5L13.96,12.29Z"/></svg>`,
  },
  spacer: {
    label: "Spacer",
    category: "Layout",
    content: '<div style="height: 50px;"></div>',
    media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M5 10H3V14H5V10M14 10H12V14H14V10M21 10H19V14H21V10M10 10H8V14H10V10M17 10H15V14H17V10Z"/></svg>`,
  },
  map: {
    label: "Map",
    category: "Media",
    content: '<div class="map" style="height: 300px;"></div>',
    media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3,4H5V10H9V4H11V16H9V11H5V16H3V4M14,10V16H12V4H14V9H18V4H20V16H18V11H14V10Z"/></svg>`,
  },
};

export const layoutElements = {
  twoColumns: {
    label: "2 Columns",
    category: "Layout",
    content: `
      <div class="row my-3">
        <div class="col-md-6"><p>Column 1 Content</p></div>
        <div class="col-md-6"><p>Column 2 Content</p></div>
      </div>
    `,
    media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 21H11V3H3M13 3V21H21V3"/></svg>`,
  },
  threeColumns: {
    label: "3 Columns",
    category: "Layout",
    content: `
      <div class="row my-3">
        <div class="col-md-4"><p>Column 1</p></div>
        <div class="col-md-4"><p>Column 2</p></div>
        <div class="col-md-4"><p>Column 3</p></div>
      </div>
    `,
    media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 21H9V3H3M10 3V21H16V3M17 3V21H23V3"/></svg>`,
  },
};
