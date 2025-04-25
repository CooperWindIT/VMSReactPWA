import React, { useEffect, useState } from "react";
import Base from "../Config/Base";
import AOS from "aos";
import "aos/dist/aos.css";
import ScrollToTop from "./../Config/ScrollTop";
import axios from "axios";
import { BASE_API_URL } from "../Config/Config";

export default function Home() {
    useEffect(() => {
        AOS.init({
            duration: 600,
            easing: "ease-in-out",
            once: true,
            mirror: false,
        });
    }, []);

    const [capabilitiesData, setCapabilitiesData] = useState(null);
    const [featureData, setFeatureData] = useState(null);
    const [randdData, setRanddData] = useState(null);

    const fetchContentByType = async (type) => {
        try {
            const response = await axios.get(
                `${BASE_API_URL}CWIRoutes/GetContentByType`,
                {
                    params: {
                        OrgId: 9330,
                        Type: type,
                    },
                }
            );
            return response.data.ResultData;
        } catch (error) {
            console.error(`Error fetching ${type}:`, error);
            return null;
        }
    };

    useEffect(() => {
        const fetchAll = async () => {
            const capabilities = await fetchContentByType("Capabilities");
            const features = await fetchContentByType("Feature");
            const randd = await fetchContentByType("R&D");

            setCapabilitiesData(capabilities);
            setFeatureData(features);
            setRanddData(randd);
        };

        fetchAll();
    }, []);

    return (
        <>
            <ScrollToTop />
            <Base>
                <section id="hero" className="hero section dark-background">
                    <div
                        id="hero-carousel"
                        className="carousel carousel-fade"
                        data-bs-ride="carousel"
                        data-bs-interval="5000"
                    >
                        <div className="container position-relative">
                            <div className="carousel-item active">
                                <div className="carousel-container">
                                    <h2>Global Supplier</h2>
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                        Integer feugiat purus nec odio cursus, sed facilisis justo
                                        interdum. Suspendisse potenti. Curabitur eget arcu at elit
                                        blandit sollicitudin.
                                    </p>
                                    <a href="#" className="btn-get-started">
                                        Read More
                                    </a>
                                </div>
                            </div>

                            <div className="carousel-item">
                                <div className="carousel-container">
                                    <h2>We Look to the FUTURE</h2>
                                    <p>
                                        Pellentesque habitant morbi tristique senectus et netus et
                                        malesuada fames ac turpis egestas. Nulla facilisi. Nam sed
                                        turpis sed justo dapibus aliquet non sed justo.
                                    </p>
                                    <a href="#" className="btn-get-started">
                                        Read More
                                    </a>
                                </div>
                            </div>

                            <div className="carousel-item">
                                <div className="carousel-container">
                                    <h2>New Goal Achieved</h2>
                                    <p>
                                        Proin volutpat, nisi in finibus ultricies, arcu massa
                                        tincidunt metus, a fermentum enim nunc ut lectus. Morbi
                                        viverra, elit at dignissim porta, tellus nunc congue mi, vel
                                        facilisis ex nulla nec velit.
                                    </p>
                                    <a href="#" className="btn-get-started">
                                        Read More
                                    </a>
                                </div>
                            </div>

                            <a
                                className="carousel-control-prev"
                                href="#hero-carousel"
                                role="button"
                                data-bs-slide="prev"
                            >
                                <span
                                    className="carousel-control-prev-icon bi bi-chevron-left"
                                    aria-hidden="true"
                                ></span>
                            </a>

                            <a
                                className="carousel-control-next"
                                href="#hero-carousel"
                                role="button"
                                data-bs-slide="next"
                            >
                                <span
                                    className="carousel-control-next-icon bi bi-chevron-right"
                                    aria-hidden="true"
                                ></span>
                            </a>

                            <ol className="carousel-indicators">
                                <button
                                    type="button"
                                    data-bs-target="#hero-carousel"
                                    data-bs-slide-to="0"
                                    className="active"
                                    aria-current="true"
                                    aria-label="Slide 1"
                                ></button>
                                <button
                                    type="button"
                                    data-bs-target="#hero-carousel"
                                    data-bs-slide-to="1"
                                    aria-label="Slide 2"
                                ></button>
                                <button
                                    type="button"
                                    data-bs-target="#hero-carousel"
                                    data-bs-slide-to="2"
                                    aria-label="Slide 3"
                                ></button>
                            </ol>
                        </div>
                    </div>
                </section>

                <section id="featured-services" className="featured-services section">
                    <div className="container">
                        <h2 className="text-center">Our Capabilities</h2>
                        <div className="row gy-4">
                            {capabilitiesData &&
                                capabilitiesData?.map((item, index) => (
                                    <div
                                        className="col-lg-3 col-md-6"
                                        data-aos="fade-up"
                                        data-aos-delay="200"
                                        key={item.Id}
                                    >
                                        <div className="service-item item-cyan position-relative">
                                            <div
                                                className="icon"
                                                dangerouslySetInnerHTML={{ __html: item.ImageUrl1 }}
                                            ></div>
                                            <a
                                                href="service-details.html"
                                                className="stretched-link text-decoration-none text-dark"
                                            >
                                                <h3>{item.Title}</h3>
                                            </a>
                                            <p>{item.Description1}</p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </section>

                <section id="about" className="about section light-background">
                    <div className="container">
                        <div className="row gy-4">
                            <div
                                className="col-lg-6 position-relative align-self-start"
                                data-aos="fade-up"
                                data-aos-delay="100"
                            >
                                <img src="assets/img/about.jpg" className="img-fluid" alt="" />
                                <a
                                    href="https://www.youtube.com/watch?v=Y7f98aduVJ8"
                                    className="glightbox pulsating-play-btn"
                                ></a>
                            </div>
                            <div
                                className="col-lg-6 content"
                                data-aos="fade-up"
                                data-aos-delay="200"
                            >
                                {randdData &&
                                    randdData?.map((item, index) => (
                                        <>
                                            <h3>{item.Title}</h3>
                                            <p className="fst-italic">{item.Description1}</p>
                                        </>
                                    ))}
                            </div>
                        </div>
                    </div>
                </section>

                <section id="features" className="features section">
                    <div className="container section-title" data-aos="fade-up">
                        <h2>Our Features</h2>
                        <p>
                            Precision-driven manufacturing solutions for the wind energy and
                            structural engineering sectors.
                        </p>
                    </div>

                    <div className="container">
                        {featureData &&
                            featureData.map((item, indx) => {
                                const isEven = indx % 2 === 0;

                                return (
                                    <div
                                        className="row gy-4 align-items-center features-item"
                                        key={indx}
                                    >
                                        {/* Image Column */}
                                        <div
                                            className={`col-md-5 d-flex align-items-center ${isEven ? "order-1 order-md-1" : "order-1 order-md-2"
                                                }`}
                                            data-aos="zoom-out"
                                            data-aos-delay="100"
                                        >
                                            <img
                                                src="assets/img/features-1.svg"
                                                className="img-fluid"
                                                alt={`Feature ${indx + 1}`}
                                            />
                                        </div>

                                        {/* Content Column */}
                                        <div
                                            className={`col-md-7 ${isEven ? "order-2 order-md-2" : "order-2 order-md-1"
                                                }`}
                                            data-aos="fade-up"
                                            data-aos-delay="100"
                                        >
                                            <h3>{item.Title}</h3>
                                            <p className="fst-italic">{item.Description1}</p>
                                            <ul>{item.Description2}</ul>
                                        </div>
                                    </div>
                                );
                            })}

                        {/* <div className="row gy-4 align-items-center features-item">
                            <div className="col-md-5 order-1 order-md-2 d-flex align-items-center" data-aos="zoom-out" data-aos-delay="200">
                                <img src="assets/img/features-2.svg" className="img-fluid" alt="Feature 2" />
                            </div>
                            <div className="col-md-7 order-2 order-md-1" data-aos="fade-up" data-aos-delay="200">
                                <h3>Advanced Welding & Structural Fabrication</h3>
                                <p className="fst-italic">
                                    Nulla facilisi. Ut placerat, augue sed vulputate egestas, orci justo bibendum eros, ac elementum risus nisi non purus.
                                </p>
                                <p>
                                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam.
                                </p>
                            </div>
                        </div>

                        <div className="row gy-4 align-items-center features-item">
                            <div className="col-md-5 d-flex align-items-center" data-aos="zoom-out">
                                <img src="assets/img/features-3.svg" className="img-fluid" alt="Feature 3" />
                            </div>
                            <div className="col-md-7" data-aos="fade-up">
                                <h3>Corrosion-Resistant Surface Treatment</h3>
                                <p>
                                    Vivamus ut libero nec arcu cursus luctus. Suspendisse potenti. In dapibus, sapien vel rutrum posuere, nisi ligula luctus mauris.
                                </p>
                                <ul>
                                    <li><i className="bi bi-check"></i> Duis sit amet velit eu augue blandit tincidunt</li>
                                    <li><i className="bi bi-check"></i> Maecenas facilisis nulla in tincidunt tempus</li>
                                    <li><i className="bi bi-check"></i> Curabitur congue urna vitae dolor tincidunt</li>
                                </ul>
                            </div>
                        </div>

                        <div className="row gy-4 align-items-center features-item">
                            <div className="col-md-5 order-1 order-md-2 d-flex align-items-center" data-aos="zoom-out">
                                <img src="assets/img/features-4.svg" className="img-fluid" alt="Feature 4" />
                            </div>
                            <div className="col-md-7 order-2 order-md-1" data-aos="fade-up">
                                <h3>Precision Cutting & Custom Ladder Systems</h3>
                                <p className="fst-italic">
                                    Praesent in lorem eu justo suscipit tincidunt. Aliquam erat volutpat. Quisque vitae justo sed est tincidunt volutpat.
                                </p>
                                <p>
                                    Etiam ullamcorper nunc nec lacus porta, nec sodales nisl viverra. Sed commodo, leo vitae mattis feugiat, felis elit fermentum sapien.
                                </p>
                            </div>
                        </div> */}
                    </div>
                </section>
            </Base>
        </>
    );
}
