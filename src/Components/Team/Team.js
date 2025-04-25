import React, { useEffect } from "react";
import Base from "../Config/Base";
import ScrollToTop from './../Config/ScrollTop';

export default function Team() {

    return (
        <>
            <ScrollToTop />
            <Base>
                <div class="page-title dark-background">
                    <div class="container position-relative">
                        <h1>Team</h1>
                        <p>Esse dolorum voluptatum ullam est sint nemo et est ipsa porro placeat quibusdam quia assumenda numquam molestias.</p>
                        <nav class="breadcrumbs">
                        <ol>
                            <li><a href="index.html">Home</a></li>
                            <li class="current">Team</li>
                        </ol>
                        </nav>
                    </div>
                </div>

                <section id="team" class="team section">
                    <div class="container">
                        <div class="row gy-5">

                            <div class="col-lg-4 col-md-6 member aos-init aos-animate" data-aos="fade-up" data-aos-delay="100">
                                <div class="member-img">
                                    <img src="assets/img/team/team-1.jpg" class="img-fluid" alt=""/>
                                    <div class="social">
                                        <a href="#"><i class="bi bi-twitter-x"></i></a>
                                        <a href="#"><i class="bi bi-facebook"></i></a>
                                        <a href="#"><i class="bi bi-instagram"></i></a>
                                        <a href="#"><i class="bi bi-linkedin"></i></a>
                                    </div>
                                </div>
                                <div class="member-info text-center">
                                    <h4>Walter White</h4>
                                    <span>Chief Operations Officer</span>
                                    <p>Oversees manufacturing processes, ensuring efficiency, safety, and adherence to industry standards at every level.</p>
                                </div>
                            </div>

                            <div class="col-lg-4 col-md-6 member aos-init aos-animate" data-aos="fade-up" data-aos-delay="200">
                                <div class="member-img">
                                    <img src="assets/img/team/team-2.jpg" class="img-fluid" alt=""/>
                                    <div class="social">
                                        <a href="#"><i class="bi bi-twitter-x"></i></a>
                                        <a href="#"><i class="bi bi-facebook"></i></a>
                                        <a href="#"><i class="bi bi-instagram"></i></a>
                                        <a href="#"><i class="bi bi-linkedin"></i></a>
                                    </div>
                                </div>
                                <div class="member-info text-center">
                                    <h4>Sarah Johnson</h4>
                                    <span>Head of Product Engineering</span>
                                    <p>Leads product development from concept to production, ensuring innovation, quality, and functionality.</p>
                                </div>
                            </div>

                            <div class="col-lg-4 col-md-6 member aos-init aos-animate" data-aos="fade-up" data-aos-delay="300">
                                <div class="member-img">
                                    <img src="assets/img/team/team-3.jpg" class="img-fluid" alt=""/>
                                    <div class="social">
                                        <a href="#"><i class="bi bi-twitter-x"></i></a>
                                        <a href="#"><i class="bi bi-facebook"></i></a>
                                        <a href="#"><i class="bi bi-instagram"></i></a>
                                        <a href="#"><i class="bi bi-linkedin"></i></a>
                                    </div>
                                </div>
                                <div class="member-info text-center">
                                    <h4>William Anderson</h4>
                                    <span>Chief Technology Officer</span>
                                    <p>Drives innovation and integrates advanced manufacturing technologies to improve automation and efficiency.</p>
                                </div>
                            </div>

                            <div class="col-lg-4 col-md-6 member aos-init aos-animate" data-aos="fade-up" data-aos-delay="400">
                                <div class="member-img">
                                    <img src="assets/img/team/team-4.jpg" class="img-fluid" alt=""/>
                                    <div class="social">
                                        <a href="#"><i class="bi bi-twitter-x"></i></a>
                                        <a href="#"><i class="bi bi-facebook"></i></a>
                                        <a href="#"><i class="bi bi-instagram"></i></a>
                                        <a href="#"><i class="bi bi-linkedin"></i></a>
                                    </div>
                                </div>
                                <div class="member-info text-center">
                                    <h4>Amanda Jepson</h4>
                                    <span>Quality Assurance Manager</span>
                                    <p>Ensures all products meet quality standards through rigorous testing, audits, and compliance checks.</p>
                                </div>
                            </div>

                            <div class="col-lg-4 col-md-6 member aos-init aos-animate" data-aos="fade-up" data-aos-delay="500">
                                <div class="member-img">
                                    <img src="assets/img/team/team-5.jpg" class="img-fluid" alt=""/>
                                    <div class="social">
                                        <a href="#"><i class="bi bi-twitter-x"></i></a>
                                        <a href="#"><i class="bi bi-facebook"></i></a>
                                        <a href="#"><i class="bi bi-instagram"></i></a>
                                        <a href="#"><i class="bi bi-linkedin"></i></a>
                                    </div>
                                </div>
                                <div class="member-info text-center">
                                    <h4>Brian Doe</h4>
                                    <span>Supply Chain Manager</span>
                                    <p>Manages procurement, logistics, and vendor relationships to ensure smooth and cost-effective operations.</p>
                                </div>
                            </div>

                            <div class="col-lg-4 col-md-6 member aos-init aos-animate" data-aos="fade-up" data-aos-delay="600">
                                <div class="member-img">
                                    <img src="assets/img/team/team-6.jpg" class="img-fluid" alt=""/>
                                    <div class="social">
                                        <a href="#"><i class="bi bi-twitter-x"></i></a>
                                        <a href="#"><i class="bi bi-facebook"></i></a>
                                        <a href="#"><i class="bi bi-instagram"></i></a>
                                        <a href="#"><i class="bi bi-linkedin"></i></a>
                                    </div>
                                </div>
                                <div class="member-info text-center">
                                    <h4>Josepha Palas</h4>
                                    <span>Plant Manager</span>
                                    <p>Supervises daily plant activities, maintains equipment, and ensures safety and production targets are met.</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </Base>
        </>
    );
}
