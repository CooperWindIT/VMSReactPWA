import React from 'react';
import Base from '../../Config/Base.js';
import ScrollToTop from '../../Config/ScrollTop';

export default function WindPowerSling() {

    const productData = [
        {
            id: 1,
            title: 'Heavy-Duty Lifting Slings',
            image: 'assets/img/conc.jpg',
            features: [
                'Designed specifically for wind turbine component handling',
                'High-load bearing capacity with minimal stretch',
                'Reinforced eye loops for secure grip',
                'Resistant to wear, UV, and chemicals'
            ]
        },
        {
            id: 2,
            title: 'Customized Sling Designs',
            image: 'assets/img/conc.jpg',
            features: [
                'Tailor-made slings for specific turbine parts like blades and hubs',
                'Complies with international safety standards',
                'Multiple configurations: endless, flat, round',
                'Color-coded for load rating identification'
            ]
        },
        {
            id: 3,
            title: 'Protective Sling Covers',
            image: 'assets/img/conc.jpg',
            features: [
                'Anti-abrasion covers to extend sling lifespan',
                'Reduces damage to delicate surfaces',
                'Available in leather, PVC, or high-durability fabric',
                'Easily attachable and reusable'
            ]
        },
        {
            id: 4,
            title: 'Sling Inspection & Certification',
            image: 'assets/img/conc.jpg',
            features: [
                'Regular maintenance and inspection services',
                'Digital tracking of sling usage and condition',
                'Certificate of compliance with each batch',
                'On-site inspection services available'
            ]
        }
    ];

    return (
        <>
            <ScrollToTop />
            <Base>
                {/* Page Title */}
                <div className="page-title dark-background">
                    <div className="container position-relative">
                        <h1>Wind Power Sling</h1>
                        <p>
                            Specialized slings engineered to safely and efficiently handle heavy wind turbine components.
                        </p>
                        <nav className="breadcrumbs">
                            <ol>
                                <li><a href="/">Home</a></li>
                                <li className="current">Wind Power Sling</li>
                            </ol>
                        </nav>
                    </div>
                </div>

                {/* Zig-Zag Product Sections */}
                <section id="wind-power-sling" className="section">
                    <div className="container">
                        {productData.map((product, index) => {
                            const isEven = index % 2 === 0;
                            return (
                                <div className="row align-items-center gy-4 my-5" key={product.id} data-aos="fade-up" data-aos-delay={`${index * 100}`}>
                                    <div className={`col-lg-6 ${isEven ? '' : 'order-lg-last'}`}>
                                        <img
                                            src={product.image}
                                            className="img-fluid w-100 rounded shadow-lg"
                                            alt={product.title}
                                        />
                                    </div>
                                    <div className={`col-lg-6 content ${isEven ? '' : 'order-lg-first'}`}>
                                        <h3>{product.title}</h3>
                                        <ul className="list-unstyled mt-3">
                                            {product.features.map((feature, idx) => (
                                                <li key={idx} className="mb-2">
                                                    <i className="bi bi-check-circle me-2 text-primary" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </Base>
        </>
    );
}
