import React from 'react';
import Base from '../Config/Base.js';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import ScrollToTop from './../Config/ScrollTop';

export default function About() {

    const clients = [
        'client-1.png',
        'client-2.png',
        'client-3.png',
        'client-4.png',
        'client-5.png',
        'client-6.png',
        'client-7.png',
        'client-8.png',
      ];

    return (
        <>
            <ScrollToTop />
            <Base>
                {/* Page Title */}
                <div className="page-title dark-background">
                    <div className="container position-relative">
                        <h1>About Us</h1>
                        <p>
                            At CWI (Code with Intelligence), we build intelligent digital solutions to transform businesses and empower innovation.
                        </p>
                        <nav className="breadcrumbs">
                            <ol>
                                <li><a href="/">Home</a></li>
                                <li className="current">About</li>
                            </ol>
                        </nav>
                    </div>
                </div>

                {/* About Section */}
                <section id="about" className="about section">
                    <div className="container">
                        <div className="row gy-4">
                            <div className="col-lg-6 position-relative align-self-start" data-aos="fade-up" data-aos-delay="100">
                                <img src="assets/img/about.jpg" className="img-fluid" alt="About CWI" />
                                <a href="https://www.youtube.com/watch?v=Y7f98aduVJ8" className="glightbox pulsating-play-btn" />
                            </div>
                            <div className="col-lg-6 content" data-aos="fade-up" data-aos-delay="200">
                                <h3>Empowering Innovation Through Smart Technology</h3>
                                <p className="fst-italic">
                                    CWI is dedicated to crafting intelligent digital experiences through custom software development, cloud integration, and data-driven solutions.
                                </p>
                                <ul>
                                    <li><i className="bi bi-check2-all" /> <span>Tailored software solutions to meet unique business goals.</span></li>
                                    <li><i className="bi bi-check2-all" /> <span>Expert team skilled in AI, web & mobile technologies.</span></li>
                                    <li><i className="bi bi-check2-all" /> <span>Transparent development process with agile methodology and full client collaboration.</span></li>
                                </ul>
                                <p>
                                    We believe in building not just software, but long-lasting partnerships. From startups to enterprises, CWI helps you innovate faster, deliver smarter, and scale securely.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section id="stats" className="stats section light-background">
                    <div className="container" data-aos="fade-up" data-aos-delay="100">
                        <div className="row gy-4">
                            {[
                                { end: 75, label: 'Happy Clients' },
                                { end: 120, label: 'Projects Delivered' },
                                { end: 8000, label: 'Hours of Development' },
                                { end: 15, label: 'Expert Developers' }
                            ].map((item, idx) => (
                                <div key={idx} className="col-lg-3 col-md-6">
                                    <div className="stats-item text-center w-100 h-100">
                                        <span data-purecounter-start="0" data-purecounter-end={item.end} data-purecounter-duration="1" className="purecounter">0</span>
                                        <p>{item.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Clients Section */}
                {/* <section id="clients" className="clients section">
                    <div className="container">
                        <div className="swiper init-swiper swiper-initialized swiper-horizontal swiper-backface-hidden">
                            <div className="swiper-wrapper align-items-center">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(index => (
                                    <div key={index} className="swiper-slide">
                                        <img src={`assets/img/clients/client-${index}.png`} className="img-fluid" alt={`Client ${index}`} />
                                    </div>
                                ))}
                            </div>
                            <span className="swiper-notification" aria-live="assertive" aria-atomic="true"></span>
                        </div>
                    </div>
                </section> */}
            <section id="clients" className="clients section">
        <div className="container">
            <Swiper
            modules={[Autoplay, Pagination]}
            loop={true}
            speed={600}
            autoplay={{ delay: 5000 }}
            pagination={{ clickable: true }}
            breakpoints={{
                320: { slidesPerView: 2, spaceBetween: 40 },
                480: { slidesPerView: 3, spaceBetween: 60 },
                640: { slidesPerView: 4, spaceBetween: 80 },
                992: { slidesPerView: 6, spaceBetween: 120 },
            }}
            className="init-swiper"
            >
            {clients.map((client, index) => (
                <SwiperSlide key={index}>
                <img
                    src={`assets/img/clients/${client}`}
                    className="img-fluid"
                    alt={`Client ${index + 1}`}
                />
                </SwiperSlide>
            ))}
            </Swiper>
        </div>
        </section>

                {/* Skills Section */}
                <section id="skills" className="skills section">
                    <div className="container section-title" data-aos="fade-up">
                        <h2>Our Core Technologies</h2>
                        <p>We're skilled across modern stacks to turn ideas into scalable products.</p>
                    </div>

                    <div className="container" data-aos="fade-up" data-aos-delay="100">
                        <div className="row skills-content skills-animation">
                            {[
                                ['HTML & CSS', 100],
                                ['React & JavaScript', 95],
                                ['Node.js & Express', 90],
                                ['Python & AI', 85],
                                ['WordPress / CMS', 80],
                                ['Design Tools (Figma, PS)', 70]
                            ].map(([skill, val], index) => (
                                <div key={index} className="col-lg-6">
                                    <div className="progress">
                                        <span className="skill"><span>{skill}</span> <i className="val">{val}%</i></span>
                                        <div className="progress-bar-wrap">
                                            <div
                                                className="progress-bar"
                                                role="progressbar"
                                                style={{ width: `${val}%` }}
                                                aria-valuenow={val}
                                                aria-valuemin="0"
                                                aria-valuemax="100"
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </Base>
        </>
    )
}