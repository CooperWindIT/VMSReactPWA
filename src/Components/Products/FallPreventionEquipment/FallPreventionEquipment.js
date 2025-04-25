import React from 'react';
import Base from '../../Config/Base.js';
import ProductImg from '../../Assets/Images/product-2.jpg';
import ScrollToTop from '../../Config/ScrollTop';

export default function FallPreventionEquipment() {

    const productData = [
        {
            id: 1,
            title: 'Product-4-a',
            image: ProductImg,
            features: [
                'Ergonomic full-body harness for long-duration wear',
                'Certified anchor points for various structures',
                'Quick-release buckles for emergency situations',
                'Adjustable straps for universal fitting'
            ]
        },
        {
            id: 2,
            title: 'Product-4-b',
            image: ProductImg,
            features: [
                'Self-retracting mechanism for improved mobility',
                'Shock-absorbing technology during sudden falls',
                'Durable and weather-resistant cables',
                'Available in various lengths and configurations'
            ]
        },
        {
            id: 3,
            title: 'Product-4-c',
            image: ProductImg,
            features: [
                'Temporary and permanent installation options',
                'No penetration into roofing surface required',
                'Corrosion-proof and lightweight materials',
                'Complies with OSHA and international standards'
            ]
        },
        {
            id: 4,
            title: 'Product-4-d',
            image: ProductImg,
            features: [
                'Versatile anchor points for different surfaces (roofs, beams, etc.)',
                'Portable anchors for mobile job sites',
                'Tested for high-load endurance',
                'Easy installation with secure locking system'
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
                        <h1>Fall Prevention Equipment</h1>
                        <p>
                            Reliable safety gear engineered to prevent accidents and protect personnel at elevated worksites.
                        </p>
                        <nav className="breadcrumbs">
                            <ol>
                                <li><a href="/">Home</a></li>
                                <li className="current">Fall Prevention Equipment</li>
                            </ol>
                        </nav>
                    </div>
                </div>

                {/* Zig-Zag Product Sections */}
                <section id="fall-prevention" className="section">
                    <div className="container">
                        <div className="row gy-5">
                            {productData.map((product, index) => (
                                <div
                                    className="col-md-6 col-lg-4"
                                    key={product.id}
                                    data-aos="zoom-in-up"
                                    data-aos-delay={`${index * 100}`}
                                >
                                    <div className="card product-card h-100 border-0 shadow rounded-4">
                                        <div className="card-img-wrapper overflow-hidden rounded-top-4">
                                            <img
                                                src={product.image}
                                                className="card-img-top img-fluid"
                                                alt={product.title}
                                            />
                                        </div>
                                        <div className="card-body p-4">
                                            <h5 className="card-title mb-3">{product.title}</h5>
                                            <ul className="list-unstyled mb-0">
                                                {product.features.map((feature, idx) => (
                                                    <li key={idx} className="mb-2 d-flex align-items-start">
                                                        <i className="bi bi-check2-circle text-success me-2 fs-5" />
                                                        <span>{feature}</span>
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
                    {`.product-card {
                        transition: transform 0.4s ease, box-shadow 0.4s ease;
                    }

                    .product-card:hover {
                        transform: translateY(-8px);
                        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
                    }

                    .card-img-wrapper img {
                        transition: transform 0.5s ease;
                    }

                    .product-card:hover .card-img-wrapper img {
                        transform: scale(1.08);
                    }
                        `}
                </style>
            </Base>
        </>
    );
}
