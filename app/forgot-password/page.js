"use client"
import Link from 'next/link';
import React, { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (emailError) setEmailError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email) {
      setEmailError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-gradient min-vh-100 d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-center align-items-center">
          {/* Logo Section - Unchanged */}
          <div className="col-lg-4 d-flex flex-column justify-content-center align-items-center text-center">
            <img
              src="assets/img/LogoProxenio.png"
              alt="Logo"
              className="img-fluid"
              style={{ maxWidth: '100%', maxHeight: '200px' }}
            />
            <h3 className="color-maroon mt-3 fs-40 fw-semibold">Proxenio</h3>
            <p className="color-maroon mt-1 fs-24">
              Find True Love with <br /> Proxenio.net
            </p>
          </div>

          {/* Card Section - Modified only the form content */}
          <div className="col-lg-5">
            <div className="card border-0 rounded-5 p-5 p-lg-7">
              {isSubmitted ? (
                <div>
                  <div className="mb-2">
                    <h3 className="text-left font-weight-light my-2">Check your email</h3>
                  </div>
                  <div className="mb-2">
                    <p className="small color-gray">
                      We've sent a password reset link to your email address.
                      <Link href="/login" className="small text-maroon">
                                          Login
                                        </Link>
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-2">
                    <h3 className="text-left font-weight-light my-2">Forgot Password?</h3>
                  </div>
                  <div className="mb-2">
                    <form onSubmit={handleSubmit}>
                      <div className="form-floating mb-3">
                        <input
                          className={`form-control ${emailError ? 'is-invalid' : ''}`}
                          id="inputEmail"
                          type="email"
                          placeholder="name@example.com"
                          value={email}
                          onChange={handleEmailChange}
                        />
                        <label htmlFor="inputEmail">Email address</label>
                        {emailError && (
                          <div className="invalid-feedback">
                            {emailError}
                          </div>
                        )}
                      </div>

                      <div className="d-flex align-items-center justify-content-between mt-4 mb-0">
                        <span className="small color-gray">
                          We will send you the recovery link.
                        </span>
                        <button
                          type="submit"
                          className="btn bg-maroon text-white px-5 no-wrap"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Sending...' : 'Send'}
                        </button>
                      </div>
                    </form>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;