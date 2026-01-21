import React from "react";
import { Link } from "react-router-dom";
import "./selfDefence.css";

const SelfDefence = () => {
    return (
        <div className="self-defence-container">
            {/* Page Header */}
            <div className="page-header text-center">
                <h1 className="page-title">Self Defense Techniques</h1>
                <p className="page-subtitle">Essential skills for everyone - simple, effective moves regardless of your size or strength</p>
            </div>
            
            {/* Vulnerable Points Section */}
            <div className="vulnerable-points">
                <h2 className="section-title">Key Vulnerable Points</h2>
                <p>Target these areas for maximum effect when defending yourself:</p>
                
                <div className="row">
                    <div className="col-md-6">
                        <div className="point-item">Eyes - Even a light poke can cause significant pain and temporary blindness</div>
                        <div className="point-item">Nose - A sharp strike can cause eyes to water and disorientation</div>
                        <div className="point-item">Throat/Adam's Apple - Affects breathing and can cause gagging</div>
                        <div className="point-item">Temples - One of the most sensitive areas of the head</div>
                    </div>
                    <div className="col-md-6">
                        <div className="point-item">Groin - Extremely sensitive in both men and women</div>
                        <div className="point-item">Knees - Vulnerable to kicks from any angle</div>
                        <div className="point-item">Instep - Stomping on the foot can create an escape opportunity</div>
                        <div className="point-item">Fingers - Easily broken when bent backwards</div>
                    </div>
                </div>
                
                <div className="gender-tip women-tip">
                    <div className="gender-title">For Women:</div>
                    <p>Carry a personal alarm and learn to use everyday objects (keys, pens) as defensive tools. Focus on creating distance rather than overpowering an attacker.</p>
                </div>
                
                <div className="gender-tip men-tip">
                    <div className="gender-title">For Men:</div>
                    <p>Be aware that most male attackers will expect groin attacks - have secondary targets ready. Use your generally greater upper body strength to control situations.</p>
                </div>
            </div>
            
            {/* Basic Techniques */}
            <h2 className="section-title text-center">Essential Defense Moves</h2>
            
            <div className="row mt-4">
                <div className="col-md-4 mb-4">
                    <div className="defense-card">
                        <div className="card-img-container">
                            <img src="/images/11.jpg" alt="Finger defense technique" />
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">Finger Control Technique</h5>
                            <p className="card-text">Grab the little finger and ring finger with one hand, and the middle and index finger with the other. Bend the wrist forward sharply to force compliance.</p>
                            <p className="card-text"><strong>Effectiveness:</strong> Works regardless of size difference when executed properly.</p>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-4 mb-4">
                    <div className="defense-card">
                        <div className="card-img-container">
                            <img src="/images/one.jpg" alt="Throat strike" />
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">Throat Strike</h5>
                            <p className="card-text">A sharp strike to the throat (Adam's apple) can incapacitate an attacker temporarily. Use a knife-hand strike or stiff fingers.</p>
                            <p className="card-text"><strong>Warning:</strong> This can be lethal if done with excessive force.</p>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-4 mb-4">
                    <div className="defense-card">
                        <div className="card-img-container">
                            <img src="/images/two.jpg" alt="Groin attack" />
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">Groin Strike</h5>
                            <p className="card-text">A knee or upward palm strike to the groin is extremely effective. Follow up immediately with additional strikes or escape.</p>
                            <p className="card-text"><strong>Variation:</strong> A twisting grab can be more effective than a strike if you can't generate much force.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Common Attack Scenarios */}
            <h2 className="section-title text-center">Defense Against Common Attacks</h2>
            
            <div className="row mt-4">
                <div className="col-md-6 mb-4">
                    <div className="defense-card">
                        <div className="card-img-container">
                            <img src="/images/three.jpg" alt="Front grab defense" />
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">Front Grab Defense</h5>
                            <p className="card-text">1. Create space by bringing your hands forward and making fists at pelvis level</p>
                            <p className="card-text">2. Headbutt to the nose or chin</p>
                            <p className="card-text">3. Follow with knee to groin</p>
                            <p className="card-text">4. Push away and create distance to escape</p>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-6 mb-4">
                    <div className="defense-card">
                        <div className="card-img-container">
                            <img src="/images/4.jpg" alt="Palm strike defense" />
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">Palm Strike Combo</h5>
                            <p className="card-text">1. Straighten your left arm to create distance</p>
                            <p className="card-text">2. Strike upward under the nose or chin with right palm</p>
                            <p className="card-text">3. Immediate knee to groin</p>
                            <p className="card-text">4. Push away while attacker is stunned</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="row">
                <div className="col-md-6 mb-4">
                    <div className="defense-card">
                        <div className="card-img-container">
                            <img src="/images/five.jpg" alt="Wrist release" />
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">Wrist Release Technique</h5>
                            <p className="card-text">The "rule of thumb": rotate your arm toward the attacker's thumb where their grip is weakest.</p>
                            <p className="card-text">1. Rotate wrist toward thumb side</p>
                            <p className="card-text">2. When arm is under attacker's, pull sharply</p>
                            <p className="card-text">3. Immediately follow up with counterattack</p>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-6 mb-4">
                    <div className="defense-card">
                        <div className="card-img-container">
                            <img src="/images/six.jpg" alt="Rear grab defense" />
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">Rear Grab Defense</h5>
                            <p className="card-text">1. Bend back to attempt headbutt (forces attacker to adjust stance)</p>
                            <p className="card-text">2. Quickly bend down and grab one leg</p>
                            <p className="card-text">3. Stand up sharply while pulling the leg</p>
                            <p className="card-text">4. As attacker falls, escape or disable further</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Advanced Scenarios */}
            <h2 className="section-title text-center">Advanced Defense Scenarios</h2>
            
            <div className="row mt-4">
                <div className="col-md-6 mb-4">
                    <div className="defense-card">
                        <div className="card-img-container">
                            <img src="/images/seven.jpg" alt="Side attack defense" />
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">Side Attack Defense</h5>
                            <p className="card-text">Elbow strikes are devastating in close quarters:</p>
                            <p className="card-text">1. Strike temple, jaw or nose with elbow</p>
                            <p className="card-text">2. Follow with elbow to solar plexus or ribs</p>
                            <p className="card-text">3. Use your free hand to control attacker's head/neck</p>
                            <p className="card-text">4. Create distance and escape</p>
                        </div>
                    </div>
                </div>
                
                <div className="col-md-6 mb-4">
                    <div className="defense-card">
                        <div className="card-img-container">
                            <img src="/images/8.jpg" alt="Wall defense" />
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">Wall/Pinned Defense</h5>
                            <p className="card-text">When pushed against a wall:</p>
                            <p className="card-text">1. If arms are up: strike armpit (very sensitive)</p>
                            <p className="card-text">2. If one arm is free: strike throat, eyes, or groin</p>
                            <p className="card-text">3. Headbutt: squat slightly then spring up to hit chin</p>
                            <p className="card-text">4. Use wall to push off and create momentum</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Prevention Tips */}
            <div className="vulnerable-points mt-5">
                <h2 className="section-title">Prevention & Awareness</h2>
                <div className="row">
                    <div className="col-md-6">
                        <h5>Situational Awareness</h5>
                        <ul className="pl-3">
                            <li>Walk with confidence and purpose</li>
                            <li>Keep headphones volume low in public</li>
                            <li>Vary your routines regularly</li>
                            <li>Trust your instincts - if something feels wrong, it probably is</li>
                        </ul>
                    </div>
                    <div className="col-md-6">
                        <h5>Everyday Safety Tools</h5>
                        <ul className="pl-3">
                            <li>Keep keys between fingers as potential weapons</li>
                            <li>Use your phone's emergency features</li>
                            <li>Carry a loud personal alarm</li>
                            <li>Learn basic self-defense moves (like those above)</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            {/* Home Button */}
            <div className="text-center">
                <Link to="/" className="home-button">
                    <i className="fas fa-home"></i> Back to Safety Portal
                </Link>
            </div>
        </div>
    );
};

export default SelfDefence; 