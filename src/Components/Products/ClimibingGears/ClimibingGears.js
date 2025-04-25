import React from 'react';
import Base from '../../Config/Base.js';
import ProductImg from '../../Assets/Images/product-2.jpg';
import ScrollToTop from '../../Config/ScrollTop';

export default function ClimbingGear() {

    const productData = [
        {
            id: 1,
            title: 'Full Body Harnesses',
            image: ProductImg,
            features: [
                'Engineered for comfort and safety during long climbs',
                'Multiple attachment points for tools and lanyards',
                'Adjustable fit with padded straps',
                'Certified to meet international climbing safety standards'
            ]
        },
        {
            id: 2,
            title: 'Shock-Absorbing Lanyards',
            image: ProductImg,
            features: [
                'Reduces impact force in the event of a fall',
                'Elastic stretch design for ease of movement',
                'Available in single and twin-leg options',
                'Integrated energy absorber for enhanced safety'
            ]
        },
        {
            id: 3,
            title: 'Climbing Helmets',
            image: ProductImg,
            features: [
                'Lightweight design with maximum head protection',
                'Adjustable suspension system for custom fit',
                'Ventilation holes for breathability',
                'Resistant to electrical and mechanical impact'
            ]
        },
        {
            id: 4,
            title: 'Carabiners & Connectors',
            image: ProductImg,
            features: [
                'High-strength aluminum and steel options',
                'Secure locking mechanisms to prevent accidental opening',
                'Suitable for various anchoring needs',
                'Tested under extreme load and weather conditions'
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
                        <h1>Climbing Gear</h1>
                        <p>
                            Premium-grade climbing equipment built for safety, comfort, and durability in industrial applications.
                        </p>
                        <nav className="breadcrumbs">
                            <ol>
                                <li><a href="/">Home</a></li>
                                <li className="current">Climbing Gear</li>
                            </ol>
                        </nav>
                    </div>
                </div>

                {/* Zig-Zag Product Sections */}
                <section id="climbing-gear" className="section">
                    <div className="container">
                        {productData && productData?.map((product, index) => {
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
