import React from 'react';
import Base from '../../Config/Base.js';
import ProductImg from '../../Assets/Images/product-2.jpg';
import ScrollToTop from '../../Config/ScrollTop';

export default function MixingTowerUnit() {
    
    const productData = [
        {
            id: 1,
            title: 'Product-2-a',
            image: ProductImg,
            features: [
                'Enhances mixing efficiency with minimal energy consumption',
                'Blades designed for uniform material dispersion',
                'Optimized for both fine and coarse material blends',
                'Low maintenance with durable build'
            ]
        },
        {
            id: 2,
            title: 'Product-2-b',
            image: ProductImg,
            features: [
                'Quick installation and dismantling for mobility',
                'Space-saving vertical design',
                'Scalable based on project requirements',
                'Corrosion-resistant materials used throughout'
            ]
        },
        {
            id: 3,
            title: 'Product-2-c',
            image: ProductImg,
            features: [
                'Touch panel interface for real-time adjustments',
                'Supports SCADA and PLC integration',
                'Batching system with auto calibration',
                'Alerts and error diagnostics in real-time'
            ]
        },
        {
            id: 4,
            title: 'Product-2-d',
            image: ProductImg,
            features: [
                'Enclosed units for reduced environmental impact',
                'Built-in dust filters for cleaner operation',
                'Noise reduction panels ensure quieter workflow',
                'Compliant with industrial emission standards'
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
                        <h1>Mixing Tower Unit</h1>
                        <p>
                            Engineered for efficient and uniform mixing in various industrial applications.
                        </p>
                        <nav className="breadcrumbs">
                            <ol>
                                <li><a href="/">Home</a></li>
                                <li className="current">Mixing Tower Unit</li>
                            </ol>
                        </nav>
                    </div>
                </div>

                {/* Zig-Zag Product Sections */}
                <section id="mixing-tower" className="section">
                    <div className="container">
                        <div className="row g-4">
                            {productData.map((product, index) => (
                                <div className="col-md-6 col-lg-4" key={product.id} data-aos="fade-up" data-aos-delay={`${index * 100}`}>
                                    <div className="card h-100 border-0 shadow-sm card-hover-effect">
                                        <img
                                            src={product.image}
                                            className="card-img-top rounded-top product-image-hover"
                                            alt={product.title}
                                        />
                                        <div className="card-body">
                                            <h5 className="card-title">{product.title}</h5>
                                            <ul className="list-unstyled">
                                                {product.features.map((feature, idx) => (
                                                    <li key={idx} className="mb-2">
                                                        <i className="bi bi-check-circle me-2 text-primary" />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                <style>
                    {`
        
        .product-image-hover {
    transition: transform 0.4s ease;
    }
    .card-hover-effect:hover .product-image-hover {
    transform: scale(1.03);
    }
    .card-hover-effect {
    transition: transform 0.4s ease, box-shadow 0.4s ease, border 0.4s ease;
    border: 1px solid transparent;
    }

    .card-hover-effect:hover {
    transform: translateY(-8px) rotateZ(0.5deg);
    border: 1px solid rgba(0, 123, 255, 0.2);
    box-shadow: 0 12px 25px rgba(0, 123, 255, 0.2);
    }

    `}
                </style>
            </Base>
        </>
    );
}
