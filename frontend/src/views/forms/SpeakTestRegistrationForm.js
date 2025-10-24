import React from 'react'
import {
    CCard, CCardBody, CCardHeader,
    CAlert, CButton
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'

export default function SpeakTestRegistrationForm() {
    const navigate = useNavigate()

    return (
        <CCard>
            <CCardHeader className="bg-warning text-white">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <strong>SPEAK Test Registration</strong>
                        <small className="ms-2">International Student Language Proficiency Test</small>
                    </div>
                </div>
            </CCardHeader>
            <CCardBody>
                <CAlert color="warning">
                    <h4 className="alert-heading">Registration is Closed</h4>
                    <p>
                        SPEAK Test Registration is Currently Closed
                    </p>
                    <hr />
                    <p className="mb-2">
                        International students who do not have a degree from an accredited U.S. institution or for whom English is a second language must take and pass the SPEAK test.
                    </p>
                    <div className="mt-3">
                        <p>
                            <strong>For more information about the SPEAK Test:</strong>
                            <CButton
                                color="link"
                                onClick={() => window.open('https://global.ucf.edu/speak-test', '_blank')}
                            >
                                Visit our website
                            </CButton>
                        </p>
                        <p>
                            <strong>For GTA Training requirements:</strong>
                            <CButton
                                color="link"
                                onClick={() => window.open('https://global.ucf.edu/gta-information', '_blank')}
                            >
                                See the GTA Information Webpage
                            </CButton>
                        </p>
                        <p className="mt-2">
                            <strong>If you have questions, please call:</strong> 407-823-2337
                        </p>
                    </div>
                </CAlert>
            </CCardBody>
        </CCard>
    )
}
