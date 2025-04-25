import React from 'react';
import Base from '../../Config/Base.js';
import ProductImg from '../../Assets/Images/product-2.jpg';
import ScrollToTop from '../../Config/ScrollTop';

export default function Lifting() {

    const productData = [
        {
            id: 1,
            title: 'Product-1-a',
            image: ProductImg,
            features: [
                'Used for heavy-duty industrial lifting operations',
                'Designed with hydraulic pressure control for safety',
                'Ideal for manufacturing, wind turbine assembly, and infrastructure',
                'Engineered for precision, load balance, and durability'
            ]
        },
        {
            id: 2,
            title: 'Product-1-b',
            image: ProductImg,
            features: [
                'Critical components for wind energy production',
                'Aerodynamic and robust blade systems',
                'Compatible with various turbine models',
                'Long lifespan materials to withstand extreme weather'
            ]
        },
        {
            id: 3,
            title: 'Product-1-c',
            image: ProductImg,
            features: [
                'High-tech panels for industrial process automation',
                'Supports both SCADA and PLC-based operations',
                'Easy to integrate with factory systems',
                'Reduces manual errors and increases process efficiency'
            ]
        },
        {
            id: 4,
            title: 'Product-1-d',
            image: ProductImg,
            features: [
                'End-to-end electrical power distribution units',
                'Ensures consistent voltage flow in operations',
                'Supports backup and failover systems',
                'Customizable for renewable integration (solar/wind)'
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
                    <h1>CWI Products</h1>
                    <p>
                        Explore our core industrial-grade products engineered for performance, safety, and innovation.
                    </p>
                    <nav className="breadcrumbs">
                        <ol>
                            <li><a href="/">Home</a></li>
                            <li className="current">CWI Products</li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Zig-Zag Product Sections */}
            <section id="products" className="section">
                <div className="container">
                    {productData.map((product, index) => {
                        const isEven = index % 2 === 0;
                        return (
                            <div className="row align-items-center gy-4 my-5" key={product.id} data-aos="fade-up" data-aos-delay={`${index * 100}`}>
                                <div className={`col-lg-6 ${isEven ? '' : 'order-lg-last'}`}>
                                    <img
                                        src={product.image}
                                        className="img-fluid w-100 rounded shadow-lg product-image-hover"
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
            <style>
                {`
                .product-image-hover {
                    transition: transform 0.4s ease, box-shadow 0.4s ease;
                }

                .product-image-hover:hover {
                    transform: scale(1.05);
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                }
                `}
            </style>
        </Base>
        </>
    );
}
