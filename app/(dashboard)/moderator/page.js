"use client";
import React, { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";

const Dashboard = () => {

    const [totals, setTotals] = useState({
        totalEarnings: 0,
        pending: 0,
        inReview: 0,
    });

    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        matchedUsers: 0,
        revenueData: [],
        userStats: { male: 0, female: 0 },
        topCities: [],
    });

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await fetch("/api/transactions");
                const data = await res.json();

                setTotals({
                    totalEarnings: data.totalEarnings || 0,
                    pending: data.pending || 0,
                    inReview: data.inReview || 0,
                });
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        fetchTransactions();
    }, []);

    const revenueChartRef = useRef(null);
    const userStatChartRef = useRef(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/stats");
                const data = await res.json();

                setStats({
                    totalUsers: data.totalUsers || 0,
                    activeUsers: data.activeUsers || 0,
                    matchedUsers: data.matchedUsers || 0,
                    revenueData: data.revenue || [],
                    userStats: { male: data.maleUsers || 0, female: data.femaleUsers || 0 },
                    topCities: data.topCities || [],
                });
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
        };

        fetchStats();
    }, []);

    useEffect(() => {
        if (revenueChartRef.current) revenueChartRef.current.destroy();
        if (userStatChartRef.current) userStatChartRef.current.destroy();

        const revenueCanvas = document.getElementById("revenue");
        if (revenueCanvas) {
            const ctx = revenueCanvas.getContext("2d");
            revenueChartRef.current = new Chart(ctx, {
                type: "bar",
                data: {
                    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    datasets: [{ backgroundColor: "#CCEABB", data: stats.revenueData }],
                },
                options: { scales: { y: { beginAtZero: true } } },
            });
        }

        const userStatCanvas = document.getElementById("userstat");
        if (userStatCanvas) {
            const ctx = userStatCanvas.getContext("2d");
            userStatChartRef.current = new Chart(ctx, {
                type: "doughnut",
                data: {
                    labels: ["Male", "Female"],
                    datasets: [{ backgroundColor: ["#CCEABB", "#FDCB9E"], data: [stats.userStats.male, stats.userStats.female] }],
                },
            });
        }
    }, [stats]);

    return (
        <div className="row">
            <div className="col-md-8">
                <div className="row mb-3">
                    {[{ title: "Total Users", value: stats.totalUsers }, { title: "Active Users", value: stats.activeUsers }, { title: "Matched Users", value: stats.matchedUsers }].map((item, index) => (
                        <div key={index} className="col-md-4">
                            <div className="card shadow-sm border-0 p-2 mb-3">
                                <div className="card-body">
                                    <div className="d-flex justify-content-between mb-3">
                                        <i className={`bi bi-${index === 2 ? "person-check" : "people"} fs-3`}></i>
                                        <span className="fs-3 fw-semibold text-green">{item.value}</span>
                                    </div>
                                    <h6 className="mb-1 text-black">{item.title}</h6>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="row mb-3">
                    <canvas id="revenue" style={{ width: "100%" }}></canvas>
                </div>
            </div>

            <div className="col-md-4">
                <div className="card bg-light border-0 shadow-sm p-4 rounded-5 border-bottom border-5 border-danger">
                    <h5 className="mb-4 fs-4">Your Earnings</h5>
                    <div className="row">
                        {["Total Earning", "Pending", "In Review"].map((label, index) => {
                            const value = index === 0 ? totals.totalEarnings : index === 1 ? totals.pending : totals.inReview;
                            return (
                                <div key={index} className="col-4 text-muted fw-light">
                                    <p className="text-muted fw-light fs-12">
                                        {label} <br />
                                        <span className={`fs-16 ${index === 0 ? "color-maroon" : "text-black"}`}>
                                            ${value}
                                        </span>
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <h4 className="fw-medium fs-22 py-4">Top Cities</h4>
                {stats.topCities.map((city, index) => (
                    <div key={index} className="progress bg-fff my-4" style={{ height: "30px" }}>
                        <div className="bg-green-linear py-1 rounded-3 " style={{ width: `${city.percentage}%`, whiteSpace: "nowrap", }}>
                            <span>{`${city.name} - ${city.percentage}%`}</span>
                        </div>
                    </div>
                ))}
                <h4 className="fw-medium fs-22 py-4">User Stats</h4>
                <canvas id="userstat" style={{ width: "100%", maxWidth: "250px" }}></canvas>
            </div>
        </div>
    );
};

export default Dashboard;
