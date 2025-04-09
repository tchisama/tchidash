// ecommerceSections.js
export const heroSections = {
  hero1: {
    label: "Hero (Centered)",
    category: "E-commerce",
    content: `
      <section class="py-5 bg-light">
        <div class="container py-5 text-center">
          <h1 class="display-4 fw-bold mb-4">Amazing Products Await</h1>
          <p class="lead mb-5">Discover our premium collection designed for your lifestyle</p>
          <div class="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <button type="button" class="btn btn-primary btn-lg px-4 gap-3">Shop Now</button>
            <button type="button" class="btn btn-outline-secondary btn-lg px-4">Learn More</button>
          </div>
        </div>
      </section>
    `,
    media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,12.5A1.5,1.5 0 0,1 10.5,11A1.5,1.5 0 0,1 12,9.5A1.5,1.5 0 0,1 13.5,11A1.5,1.5 0 0,1 12,12.5M7.5,10.5A1.5,1.5 0 0,1 6,12A1.5,1.5 0 0,1 4.5,10.5A1.5,1.5 0 0,1 6,9A1.5,1.5 0 0,1 7.5,10.5M16.5,10.5A1.5,1.5 0 0,1 18,9A1.5,1.5 0 0,1 19.5,10.5A1.5,1.5 0 0,1 18,12A1.5,1.5 0 0,1 16.5,10.5Z"/></svg>`,
  },
  hero2: {
    label: "Hero (With Image)",
    category: "E-commerce",
    content: `
      <section class="py-5">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-6">
              <h1 class="display-4 fw-bold mb-4">${Math.random()}</h1>
              <p class="lead mb-4">The best styles for your summer adventures</p>
              <button class="btn btn-primary btn-lg">Shop Collection</button>
            </div>
            <div class="col-lg-6">
              <img src="https://via.placeholder.com/600x400" alt="Summer Collection" class="img-fluid rounded shadow">
            </div>
          </div>
        </div>
      </section>
    `,
    media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z"/></svg>`,
  },
};

export const productSections = {
  featuredProducts: {
    label: "Featured Products",
    category: "E-commerce",
    content: `
      <section class="py-5 bg-light">
        <div class="container">
          <h2 class="text-center mb-5">Featured Products</h2>
          <div class="row">
            <div class="col-md-4 mb-4">
              <div class="card h-100">
                <img src="https://via.placeholder.com/300x200" class="card-img-top" alt="Product">
                <div class="card-body">
                  <h5 class="card-title">Premium Product</h5>
                  <p class="card-text">$99.99</p>
                  <button class="btn btn-primary">Add to Cart</button>
                </div>
              </div>
            </div>
            <div class="col-md-4 mb-4">
              <div class="card h-100">
                <img src="https://via.placeholder.com/300x200" class="card-img-top" alt="Product">
                <div class="card-body">
                  <h5 class="card-title">Best Seller</h5>
                  <p class="card-text">$79.99</p>
                  <button class="btn btn-primary">Add to Cart</button>
                </div>
              </div>
            </div>
            <div class="col-md-4 mb-4">
              <div class="card h-100">
                <img src="https://via.placeholder.com/300x200" class="card-img-top" alt="Product">
                <div class="card-body">
                  <h5 class="card-title">New Arrival</h5>
                  <p class="card-text">$89.99</p>
                  <button class="btn btn-primary">Add to Cart</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `,
    media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,10.5A1.5,1.5 0 0,1 13.5,12A1.5,1.5 0 0,1 12,13.5A1.5,1.5 0 0,1 10.5,12A1.5,1.5 0 0,1 12,10.5M7.5,10.5A1.5,1.5 0 0,1 9,12A1.5,1.5 0 0,1 7.5,13.5A1.5,1.5 0 0,1 6,12A1.5,1.5 0 0,1 7.5,10.5M16.5,10.5A1.5,1.5 0 0,1 18,12A1.5,1.5 0 0,1 16.5,13.5A1.5,1.5 0 0,1 15,12A1.5,1.5 0 0,1 16.5,10.5Z"/></svg>`,
  },
  productGrid: {
    label: "Product Grid (4 Items)",
    category: "E-commerce",
    content: `
      <section class="py-5">
        <div class="container">
          <div class="d-flex justify-content-between align-items-center mb-5">
            <h2 class="mb-0">Our Products</h2>
            <a href="#" class="btn btn-outline-primary">View All</a>
          </div>
          <div class="row">
            <div class="col-lg-3 col-md-6 mb-4">
              <div class="card h-100 border-0 shadow-sm">
                <div class="badge bg-danger text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Sale</div>
                <img src="https://via.placeholder.com/300x300" class="card-img-top" alt="Product">
                <div class="card-body">
                  <h5 class="card-title">Product Name</h5>
                  <div class="d-flex justify-content-between align-items-center">
                    <span class="text-muted text-decoration-line-through">$99.99</span>
                    <span class="fw-bold">$79.99</span>
                  </div>
                </div>
                <div class="card-footer bg-transparent">
                  <button class="btn btn-primary w-100">Add to Cart</button>
                </div>
              </div>
            </div>
            <!-- Repeat for 3 more products -->
          </div>
        </div>
      </section>
    `,
    media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3,11H11V3H3M3,21H11V13H3M13,21H21V13H13M13,3V11H21V3"/></svg>`,
  },
};

export const featureSections = {
  features: {
    label: "Features (Icon Grid)",
    category: "E-commerce",
    content: `
      <section class="py-5 bg-light">
        <div class="container">
          <h2 class="text-center mb-5">Why Choose Us</h2>
          <div class="row text-center">
            <div class="col-md-4 mb-4">
              <div class="icon-square bg-light text-dark d-inline-flex align-items-center justify-content-center fs-4 rounded mb-3">
                <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor"><path d="M5.5 1a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM3.79 3.743L4.94 4.93l-1.06 1.06L2.18 4.315a.5.5 0 0 1 .707-.707l.9 1.136zM12.94 4.93l1.15-1.188a.5.5 0 0 1 .707.707l-1.684 1.732-1.06-1.06.887-.915zM8 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 1a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/></svg>
              </div>
              <h4>Fast Shipping</h4>
              <p>Get your order within 2-3 business days</p>
            </div>
            <div class="col-md-4 mb-4">
              <div class="icon-square bg-light text-dark d-inline-flex align-items-center justify-content-center fs-4 rounded mb-3">
                <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor"><path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.42 2.259l-2.234-.893zM4.25 4.616l7.5-.938L13.75 6l-7.5.936L4.25 4.616zM13.5 6.61l-7.5.936v6.628l7.5-.938V6.609zM4.75 7.55l-2.5.936v6.628l2.5-.938V7.55zM2.25 14.09l-1.75-.7v-6.628l1.75.7V14.09z"/></svg>
              </div>
              <h4>Quality Products</h4>
              <p>Premium materials and craftsmanship</p>
            </div>
            <div class="col-md-4 mb-4">
              <div class="icon-square bg-light text-dark d-inline-flex align-items-center justify-content-center fs-4 rounded mb-3">
                <svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor"><path d="M12 1a1 1 0 0 1 1 1v10.755S12 11 8 11s-5 1.755-5 1.755V2a1 1 0 0 1 1-1h8zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4z"/><path d="M8 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>
              </div>
              <h4>Secure Checkout</h4>
              <p>100% secure payment processing</p>
            </div>
          </div>
        </div>
      </section>
    `,
    media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,2C6.5,2 2,6.5 2,12S6.5,22 12,22 22,17.5 22,12 17.5,2 12,2M10,17L5,12L6.41,10.59L10,14.17L17.59,6.58L19,8L10,17Z"/></svg>`,
  },
};

export const testimonialSections = {
  testimonials: {
    label: "Testimonials",
    category: "E-commerce",
    content: `
      <section class="py-5">
        <div class="container">
          <h2 class="text-center mb-5">What Our Customers Say</h2>
          <div class="row">
            <div class="col-md-4 mb-4">
              <div class="card h-100">
                <div class="card-body text-center">
                  <img src="https://via.placeholder.com/100" class="rounded-circle mb-3" alt="Customer">
                  <p class="card-text">"Great products and excellent customer service!"</p>
                  <div class="text-warning mb-2">
                    <i class="bi bi-star-fill"></i>
                    <i class="bi bi-star-fill"></i>
                    <i class="bi bi-star-fill"></i>
                    <i class="bi bi-star-fill"></i>
                    <i class="bi bi-star-fill"></i>
                  </div>
                  <p class="text-muted">- Jane D.</p>
                </div>
              </div>
            </div>
            <!-- Repeat for 2 more testimonials -->
          </div>
        </div>
      </section>
    `,
    media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 20A8 8 0 0 1 4 12A8 8 0 0 1 12 4A8 8 0 0 1 20 12A8 8 0 0 1 12 20M12 2A10 10 0 0 0 2 12A10 10 0 0 0 12 22A10 10 0 0 0 22 12A10 10 0 0 0 12 2M12 12.5A1.5 1.5 0 0 1 10.5 11A1.5 1.5 0 0 1 12 9.5A1.5 1.5 0 0 1 13.5 11A1.5 1.5 0 0 1 12 12.5M7.5 10.5A1.5 1.5 0 0 1 6 12A1.5 1.5 0 0 1 4.5 10.5A1.5 1.5 0 0 1 6 9A1.5 1.5 0 0 1 7.5 10.5M16.5 10.5A1.5 1.5 0 0 1 18 9A1.5 1.5 0 0 1 19.5 10.5A1.5 1.5 0 0 1 18 12A1.5 1.5 0 0 1 16.5 10.5Z"/></svg>`,
  },
};

export const ctaSections = {
  cta1: {
    label: "CTA (Simple)",
    category: "E-commerce",
    content: `
      <section class="py-5 bg-primary text-white">
        <div class="container text-center">
          <h2 class="mb-4">Ready to get started?</h2>
          <p class="lead mb-4">Join thousands of satisfied customers today</p>
          <button class="btn btn-light btn-lg">Shop Now</button>
        </div>
      </section>
    `,
    media: `<svg viewBox="0 0 24 24"><path fill="currentColor" d="M15,12H16.5V16.25L19.36,17.94L18.61,19.16L15,17V12M19,8H3V18H9.29C9.1,17.37 9,16.7 9,16A7,7 0 0,1 16,9C17.07,9 18.09,9.24 19,9.67V8M3,20C1.89,20 1,19.1 1,18V6C1,4.89 1.89,4 3,4H4V2H6V4H18V2H20V4H21A2,2 0 0,1 23,6V13.1C22.24,13.5 21.53,14 20.91,14.59C20.39,15.12 20,15.74 19.69,16.41C19.42,17.06 19.25,17.75 19.18,18.46C19.18,18.47 19.18,18.47 19.18,18.48C19.17,18.49 19.17,18.5 19.16,18.5H3Z"/></svg>`,
  },
};
