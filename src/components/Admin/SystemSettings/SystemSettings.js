// components/SystemSettings/SystemSettings.jsx
import React from "react";
import Sidebar from "../Layout/Sidebar";
import Header from "../Layout/Header";
import "./SystemSettings.css";

const SystemSettings = () => {
  return (
    <div className="ta-layout-wrapper">
      <Sidebar />
      
      <div className="ta-main-wrapper">
        <Header />
        
        <div className="ta-content-area">
          <div className="system-settings-wrapper">
            
            {/* Page Header */}
            <div className="system-settings-header">
              <div>
                <h2>System Settings</h2>
                <p>Configure system-wide preferences and defaults</p>
              </div>
            </div>

            <div className="row g-4">
              {/* Left Column */}
              <div className="col-lg-8">
                
                {/* General Settings */}
                <div className="settings-card">
                  <div className="settings-card-header">
                    <h4>General Settings</h4>
                    <p>Basic system configuration</p>
                  </div>
                  
                  <div className="settings-form-group">
                    <label className="settings-label">Organization Name</label>
                    <input 
                      type="text" 
                      className="settings-input"
                      defaultValue="Industrial Training Corp"
                    />
                  </div>
                  
                  <div className="settings-form-group">
                    <label className="settings-label">Default Timezone</label>
                    <select className="settings-select">
                      <option value="UTC+0">UTC+0 (London)</option>
                      <option value="UTC+5">UTC+5 (New York)</option>
                      <option value="UTC+8">UTC+8 (Singapore)</option>
                    </select>
                  </div>
                  
                  <div className="settings-form-group">
                    <label className="settings-label">Date Format</label>
                    <select className="settings-select">
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    </select>
                  </div>
                </div>
                
                {/* Divider */}
                <hr className="settings-divider" />
                
                {/* Notifications */}
                <div className="settings-card">
                  <div className="settings-card-header">
                    <h4>Notifications</h4>
                    <p>Alert and notification preferences</p>
                  </div>
                  
                  <div className="settings-toggle-group">
                    <div className="settings-toggle-item">
                      <div>
                        <label className="settings-toggle-label">Email Notifications</label>
                        <p className="settings-toggle-desc">Send email alerts for important events</p>
                      </div>
                      <label className="settings-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="settings-slider"></span>
                      </label>
                    </div>
                    
                    <div className="settings-toggle-item">
                      <div>
                        <label className="settings-toggle-label">Compliance Alerts</label>
                        <p className="settings-toggle-desc">Alert when compliance issues arise</p>
                      </div>
                      <label className="settings-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="settings-slider"></span>
                      </label>
                    </div>
                    
                    <div className="settings-toggle-item">
                      <div>
                        <label className="settings-toggle-label">System Health Alerts</label>
                        <p className="settings-toggle-desc">Notify on system status changes</p>
                      </div>
                      <label className="settings-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="settings-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

              </div>
              
              {/* Right Column */}
              <div className="col-lg-4">
                
                {/* Security Card */}
                <div className="settings-card">
                  <div className="settings-card-header">
                    <h4>Security</h4>
                    <p>Security and access controls</p>
                  </div>
                  
                  <div className="settings-security-group">
                    <div className="settings-security-item">
                      <label className="settings-toggle-label">Two-Factor Authentication</label>
                      <p className="settings-security-desc">Require 2FA for all admin users</p>
                      <label className="settings-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="settings-slider"></span>
                      </label>
                    </div>
                    
                    <div className="settings-security-item">
                      <label className="settings-toggle-label">Session Timeout</label>
                      <p className="settings-security-desc">Auto logout after inactivity</p>
                      <label className="settings-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="settings-slider"></span>
                      </label>
                    </div>
                    
                    <div className="settings-form-group">
                      <label className="settings-label">Timeout Duration (minutes)</label>
                      <input 
                        type="number" 
                        className="settings-input"
                        defaultValue="30"
                      />
                    </div>
                  </div>
                </div>
                
                {/* User Management Card */}
                <div className="settings-card">
                  <div className="settings-card-header">
                    <h4>User Management</h4>
                    <p>Default user settings</p>
                  </div>
                  
                  <div className="settings-toggle-group">
                    <div className="settings-toggle-item">
                      <div>
                        <label className="settings-toggle-label">Auto-approve New Candidates</label>
                        <p className="settings-toggle-desc">Skip manual approval for registrations</p>
                      </div>
                      <label className="settings-switch">
                        <input type="checkbox" />
                        <span className="settings-slider"></span>
                      </label>
                    </div>
                    
                    <div className="settings-toggle-item">
                      <div>
                        <label className="settings-toggle-label">Require Email Verification</label>
                        <p className="settings-toggle-desc">Verify email before account activation</p>
                      </div>
                      <label className="settings-switch">
                        <input type="checkbox" defaultChecked />
                        <span className="settings-slider"></span>
                      </label>
                    </div>
                    
                    <div className="settings-form-group">
                      <label className="settings-label">Default Starting Level</label>
                      <input 
                        type="number" 
                        className="settings-input"
                        defaultValue="0"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
            
            {/* Email Configuration - Full Width */}
            <div className="row mt-4">
              <div className="col-12">
                <div className="settings-card">
                  <div className="settings-card-header">
                    <h4>Email Configuration</h4>
                    <p>SMTP and email delivery settings</p>
                  </div>
                  
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="settings-form-group">
                        <label className="settings-label">SMTP Host</label>
                        <input 
                          type="text" 
                          className="settings-input"
                          defaultValue="smtp.company.com"
                        />
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="settings-form-group">
                        <label className="settings-label">SMTP Username</label>
                        <input 
                          type="text" 
                          className="settings-input"
                          defaultValue="noreply@company.com"
                        />
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="settings-form-group">
                        <label className="settings-label">From Email</label>
                        <input 
                          type="email" 
                          className="settings-input"
                          defaultValue="training@company.com"
                        />
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="settings-form-group">
                        <label className="settings-label">SMTP Port</label>
                        <input 
                          type="number" 
                          className="settings-input"
                          defaultValue="587"
                        />
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="settings-form-group">
                        <label className="settings-label">SMTP Password</label>
                        <input 
                          type="password" 
                          className="settings-input"
                          defaultValue="**********"
                        />
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="settings-form-group">
                        <label className="settings-label">From Name</label>
                        <input 
                          type="text" 
                          className="settings-input"
                          defaultValue="Training Admin System"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="settings-actions mt-4">
                    <button className="settings-save-btn">Save Changes</button>
                    <button className="settings-cancel-btn">Cancel</button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;