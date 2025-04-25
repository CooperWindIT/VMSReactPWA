import React from 'react';
import Base from '../../Config/Base.js';
import ProductImg from '../../Assets/Images/product-2.jpg';
import ScrollToTop from '../../Config/ScrollTop';

export default function PhotovoltaicCleaningRobot() {

    const productData = [
        {
            id: 1,
            title: 'Product-3-a',
            image: ProductImg,
            features: [
                'Non-contact brushless cleaning for delicate solar panels',
                'Auto-adjust height system for uneven surfaces',
                'Low water usage with high-pressure misting',
                'Ideal for both rooftop and ground-mounted solar setups'
            ]
        },
        {
            id: 2,
            title: 'Product-3-b',
            image: ProductImg,
            features: [
                'Path optimization using onboard AI',
                'Obstacle detection and smart rerouting',
                'Works seamlessly across large solar farms',
                'Real-time monitoring with app connectivity'
            ]
        },
        {
            id: 3,
            title: 'Product-3-c',
            image: ProductImg,
            features: [
                'Solar-powered recharging station integration',
                'Designed for minimum downtime',
                'Lightweight chassis with long-lasting battery life',
                'Smart power management for continuous cleaning cycles'
            ]
        },
        {
            id: 4,
            title: 'Product-3-d',
            image: ProductImg,
            features: [
                'Rain detection to auto-pause cleaning',
                'Dust sensor triggers auto-clean mode',
                'Heat-resistant components for high-temp environments',
                'Performs optimally under various climatic conditions'
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
                        <h1>Product-3</h1>
                        <p>
                            Smart cleaning solutions designed for efficient, safe, and automated maintenance of solar panel systems.
                        </p>
                        <nav className="breadcrumbs">
                            <ol>
                                <li><a href="/">Home</a></li>
                                <li className="current">Photovoltaic Cleaning Robot</li>
                            </ol>
                        </nav>
                    </div>
                </div>

                {/* Zig-Zag Product Sections */}

                <section id="pv-cleaning-robot" className="section">
                    <div className="container">
                        <div className="row gy-4">
                            {productData.map((product, index) => (
                                <div
                                    className="col-md-6 col-lg-4 mb-4"
                                    key={product.id}
                                    data-aos="fade-up"
                                    data-aos-delay={`${index * 100}`}
                                >
                                    <div className="flip-card">
                                        <div className="flip-card-inner">
                                            {/* Front Side */}
                                            <div className="flip-card-front">
                                                <img
                                                    src={product.image}
                                                    className="img-fluid w-100 h-100 object-fit-cover"
                                                    alt={product.title}
                                                />
                                                <p>{product.title}</p>
                                            </div>

                                            {/* Back Side */}
                                            <div className="flip-card-back">
                                                <h5 className="mb-3">{product.title}</h5>
                                                <ul className="list-unstyled">
                                                    {product.features.map((feature, idx) => (
                                                        <li key={idx} className="mb-2">
                                                            <i className="bi bi-check-circle me-2" />
                                                            {feature}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <h5 className="mt-2 text-center">{product.title}</h5>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <style>
                    {`.flip-card {
                        background-color: transparent;
                        perspective: 1000px;
                        cursor: pointer;
                        height: 350px;
                        }

                        .flip-card-inner {
                        position: relative;
                        width: 100%;
                        height: 100%;
                        transition: transform 0.8s ease;
                        transform-style: preserve-3d;
                        }

                        .flip-card:hover .flip-card-inner {
                        transform: rotateY(180deg);
                        }

                        .flip-card-front,
                        .flip-card-back {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        border-radius: 16px;
                        overflow: hidden;
                        backface-visibility: hidden;
                        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                        }

                        .flip-card-front img {
                        object-fit: cover;
                        height: 100%;
                        width: 100%;
                        }

                        .flip-card-back {
                        background: linear-gradient(135deg, #007bff, #00c6ff);
                        color: white;
                        padding: 25px;
                        transform: rotateY(180deg);
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        }
                        `}
                </style>
            </Base>
        </>
    );
}
