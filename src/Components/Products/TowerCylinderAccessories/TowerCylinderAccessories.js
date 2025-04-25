import React from 'react';
import Base from '../../Config/Base.js';
import ScrollToTop from '../../Config/ScrollTop';

export default function TowerCylinderAccessories() {

    const productData = [
        {
            id: 1,
            title: 'Hydraulic Cylinders',
            image: 'assets/img/conc.jpg',
            features: [
                'Heavy-duty performance for tower assembly applications',
                'Precision movement with minimal leakage',
                'Compatible with various lifting frameworks',
                'Custom stroke lengths available'
            ]
        },
        {
            id: 2,
            title: 'Cylinder Mounting Brackets',
            image: 'assets/img/conc.jpg',
            features: [
                'Robust support for hydraulic cylinder placement',
                'Ensures stability and safety under high loads',
                'Adjustable fittings for multiple configurations',
                'Corrosion-resistant for long service life'
            ]
        },
        {
            id: 3,
            title: 'High-Pressure Hoses',
            image: 'assets/img/conc.jpg',
            features: [
                'Designed to withstand extreme pressures and temperatures',
                'Flexible and kink-resistant construction',
                'Secure coupling with standard hydraulic systems',
                'Oil and chemical resistant exterior'
            ]
        },
        {
            id: 4,
            title: 'Control Manifolds',
            image: 'assets/img/conc.jpg',
            features: [
                'Centralized control for multiple cylinder operations',
                'Pressure-relief and check valve integrated',
                'Compact design for easy installation',
                'Built for high-pressure tower-lifting systems'
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
                        <h1>Tower Cylinder Accessories</h1>
                        <p>
                            Precision components engineered to support and enhance hydraulic tower systems.
                        </p>
                        <nav className="breadcrumbs">
                            <ol>
                                <li><a href="/">Home</a></li>
                                <li className="current">Tower Cylinder Accessories</li>
                            </ol>
                        </nav>
                    </div>
                </div>

                {/* Zig-Zag Product Sections */}
                <section id="tower-cylinder-accessories" className="section">
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
