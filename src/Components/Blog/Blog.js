import React, { useState } from "react";
import Base from "../Config/Base.js";
import { Link } from "react-router-dom";
import ScrollToTop from './../Config/ScrollTop';

export default function Blog() {
    return (
        <>
            <ScrollToTop />
            <Base>
                <main className="main">
                    {/* Page Title */}
                    <div className="page-title dark-background">
                        <div className="container position-relative">
                            <h1>Blog</h1>
                            <p>
                                Explore the latest insights, innovations, and updates in wind
                                energy and sustainability from Cooper Wind India.
                            </p>
                            <nav className="breadcrumbs">
                                <ol>
                                    <li>
                                        <Link to="/">Home</Link>
                                    </li>
                                    <li className="current">Blog</li>
                                </ol>
                            </nav>
                        </div>
                    </div>

                    {/* Blog Posts Section */}
                    <section id="blog-posts" className="blog-posts section">
                        <div className="container">
                            <div className="row gy-4">
                                {[
                                    {
                                        category: "Innovation",
                                        title:
                                            "Next-Gen Wind Turbines: Efficiency and Sustainability",
                                        author: "Anita Deshmukh",
                                        date: "2025-02-10",
                                        img: "/assets/img/blog/blog-1.jpg",
                                        authorImg: "/assets/img/blog/blog-author.jpg",
                                    },
                                    {
                                        category: "Technology",
                                        title: "How IoT is Revolutionizing Wind Energy Monitoring",
                                        author: "Rajeev Menon",
                                        date: "2025-01-28",
                                        img: "/assets/img/blog/blog-2.jpg",
                                        authorImg: "/assets/img/blog/blog-author-2.jpg",
                                    },
                                    {
                                        category: "Environment",
                                        title: "Reducing Carbon Footprint Through Renewable Energy",
                                        author: "Priya Sharma",
                                        date: "2025-01-15",
                                        img: "/assets/img/blog/blog-3.jpg",
                                        authorImg: "/assets/img/blog/blog-author-3.jpg",
                                    },
                                    {
                                        category: "Operations",
                                        title: "Wind Farm Maintenance: Best Practices and Tools",
                                        author: "Kunal Arora",
                                        date: "2025-03-01",
                                        img: "/assets/img/blog/blog-4.jpg",
                                        authorImg: "/assets/img/blog/blog-author-4.jpg",
                                    },
                                    {
                                        category: "Research",
                                        title: "Wind Patterns in India: A Regional Analysis",
                                        author: "Dr. Meera Iyer",
                                        date: "2025-02-20",
                                        img: "/assets/img/blog/blog-5.jpg",
                                        authorImg: "/assets/img/blog/blog-author-5.jpg",
                                    },
                                    {
                                        category: "News",
                                        title: "CWI Launches New Manufacturing Facility in Gujarat",
                                        author: "Rohan Kapoor",
                                        date: "2025-02-01",
                                        img: "/assets/img/blog/blog-6.jpg",
                                        authorImg: "/assets/img/blog/blog-author-6.jpg",
                                    },
                                ].map((post, index) => (
                                    <div className="col-lg-4" key={index}>
                                        <article>
                                            <div className="post-img">
                                                <img src={post.img} alt="" className="img-fluid" />
                                            </div>
                                            <p className="post-category">{post.category}</p>
                                            <h2 className="title">
                                                <Link to="/blog" className="text-decoration-none">{post.title}</Link>
                                            </h2>
                                            <div className="d-flex align-items-center">
                                                <img
                                                    src={post.authorImg}
                                                    alt=""
                                                    className="img-fluid post-author-img flex-shrink-0"
                                                />
                                                <div className="post-meta">
                                                    <p className="post-author">{post.author}</p>
                                                    <p className="post-date">
                                                        <time dateTime={post.date}>
                                                            {new Date(post.date).toLocaleDateString("en-US", {
                                                                month: "short",
                                                                day: "numeric",
                                                                year: "numeric",
                                                            })}
                                                        </time>
                                                    </p>
                                                </div>
                                            </div>
                                        </article>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Blog Pagination Section */}
                    <section id="blog-pagination" className="blog-pagination section">
                        <div className="container">
                            <div className="d-flex justify-content-center">
                                <ul>
                                    <li>
                                        <Link to="#">
                                            <i className="bi bi-chevron-left"></i>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#">1</Link>
                                    </li>
                                    <li>
                                        <Link to="#" className="active">
                                            2
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="#">3</Link>
                                    </li>
                                    <li>
                                        <Link to="#">4</Link>
                                    </li>
                                    <li>...</li>
                                    <li>
                                        <Link to="#">10</Link>
                                    </li>
                                    <li>
                                        <Link to="#">
                                            <i className="bi bi-chevron-right"></i>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>
                </main>
            </Base>
        </>
    );
}
