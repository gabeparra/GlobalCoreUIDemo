// src/views/forms/AllRequestsList.js
import React, { useState, useEffect } from 'react'
import {
    CCard, CCardBody, CCardHeader,
    CRow, CCol, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
    CButton, CSpinner, CAlert, CAccordion, CAccordionItem, CAccordionHeader, CAccordionBody,
    CNav, CNavItem, CNavLink, CTabContent, CTabPane,
    CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter
} from '@coreui/react'

export default function AllRequestsList() {
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteSuccess, setDeleteSuccess] = useState(false)
    const [activeTab, setActiveTab] = useState(1)
    const [selectedRequests, setSelectedRequests] = useState([])
    const [viewModalVisible, setViewModalVisible] = useState(false)
    const [selectedRequest, setSelectedRequest] = useState(null)

    const fetchRequests = async () => {
        try {
            setLoading(true)

            // Fetch all request types
            const [i20Response, academicResponse, administrativeResponse, conversationResponse, optResponse, documentResponse, volunteerResponse, housingResponse] = await Promise.all([
                fetch('http://localhost:8000/api/i20-requests/'),
                fetch('http://localhost:8000/api/academic-training/'),
                fetch('http://localhost:8000/api/administrative-record/'),
                fetch('http://localhost:8000/api/conversation-partner/'),
                fetch('http://localhost:8000/api/opt-requests/'),
                fetch('http://localhost:8000/api/document-requests/'),
                fetch('http://localhost:8000/api/english-language-volunteer/'),
                fetch('http://localhost:8000/api/off-campus-housing/')
            ])

            if (!i20Response.ok) {
                throw new Error(`I-20 HTTP error! Status: ${i20Response.status}`)
            }

            if (!academicResponse.ok) {
                throw new Error(`Academic Training HTTP error! Status: ${academicResponse.status}`)
            }

            if (!administrativeResponse.ok) {
                throw new Error(`Administrative Record HTTP error! Status: ${administrativeResponse.status}`)
            }

            if (!conversationResponse.ok) {
                throw new Error(`Conversation Partner HTTP error! Status: ${conversationResponse.status}`)
            }

            if (!optResponse.ok) {
                throw new Error(`OPT Request HTTP error! Status: ${optResponse.status}`)
            }

            if (!documentResponse.ok) {
                throw new Error(`Document Request HTTP error! Status: ${documentResponse.status}`)
            }

            if (!volunteerResponse.ok) {
                throw new Error(`English Language Volunteer HTTP error! Status: ${volunteerResponse.status}`)
            }

            if (!housingResponse.ok) {
                throw new Error(`Off Campus Housing HTTP error! Status: ${housingResponse.status}`)
            }

            const i20Data = await i20Response.json()
            const academicData = await academicResponse.json()
            const administrativeData = await administrativeResponse.json()
            const conversationData = await conversationResponse.json()
            const optData = await optResponse.json()
            const documentData = await documentResponse.json()
            const volunteerData = await volunteerResponse.json()
            const housingData = await housingResponse.json()

            // Combine all datasets
            const allRequests = [...i20Data, ...academicData, ...administrativeData, ...conversationData, ...optData, ...documentData, ...volunteerData, ...housingData]
            console.log('Fetched I-20 requests:', i20Data.length)
            console.log('Fetched Academic Training requests:', academicData.length)
            console.log('Fetched Administrative Record requests:', administrativeData.length)
            console.log('Fetched Conversation Partner requests:', conversationData.length)
            console.log('Fetched OPT requests:', optData.length)
            console.log('Fetched Document requests:', documentData.length)
            console.log('Fetched English Language Volunteer requests:', volunteerData.length)
            console.log('Fetched Off Campus Housing requests:', housingData.length)
            console.log('Total requests:', allRequests.length)

            setRequests(allRequests)
            setError(null)
        } catch (err) {
            console.error('Error fetching requests:', err)
            setError(`Failed to load requests: ${err.message}`)
        } finally {
            setLoading(false)
        }
    }

    // Function to delete a single request
    const deleteRequest = async (requestId, program) => {
        try {
            setIsDeleting(true)
            setError(null)

            let endpoint;
            if (program === 'Academic Training') {
                endpoint = `http://localhost:8000/api/academic-training/${requestId}`
            } else if (program === 'Administrative Record Change') {
                endpoint = `http://localhost:8000/api/administrative-record/${requestId}`
            } else if (program === 'Conversation Partner') {
                endpoint = `http://localhost:8000/api/conversation-partner/${requestId}`
            } else if (program === 'OPT Request') {
                endpoint = `http://localhost:8000/api/opt-requests/${requestId}`
            } else if (program === 'Document Request') {
                endpoint = `http://localhost:8000/api/document-requests/${requestId}`
            } else if (program === 'English Language Program Volunteer') {
                endpoint = `http://localhost:8000/api/english-language-volunteer/${requestId}`
            } else if (program === 'Off Campus Housing Application') {
                endpoint = `http://localhost:8000/api/off-campus-housing/${requestId}`
            } else {
                endpoint = `http://localhost:8000/api/i20-requests/${requestId}`
            }

            const response = await fetch(endpoint, {
                method: 'DELETE',
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`Failed to delete request: ${response.status} ${response.statusText} - ${errorText}`)
            }

            console.log(`Request ${requestId} deleted successfully`)

            // Remove from local state
            setRequests(prev => prev.filter(req => req.id !== requestId))
            setSelectedRequests(prev => prev.filter(id => id !== requestId))
            setDeleteSuccess(true)

            // Hide success message after 3 seconds
            setTimeout(() => {
                setDeleteSuccess(false)
            }, 3000)

        } catch (err) {
            console.error('Error deleting request:', err)
            setError(`Failed to delete request: ${err.message}`)
        } finally {
            setIsDeleting(false)
        }
    }

    // Function to delete multiple selected requests
    const deleteSelectedRequests = async () => {
        if (selectedRequests.length === 0) return

        try {
            setIsDeleting(true)
            setError(null)
            setDeleteSuccess(false)

            // Delete each selected request
            const deletePromises = selectedRequests.map(reqId => {
                const request = requests.find(r => r.id === reqId)
                let endpoint;
                if (request.program === 'Academic Training') {
                    endpoint = `http://localhost:8000/api/academic-training/${reqId}`
                } else if (request.program === 'Administrative Record Change') {
                    endpoint = `http://localhost:8000/api/administrative-record/${reqId}`
                } else if (request.program === 'Conversation Partner') {
                    endpoint = `http://localhost:8000/api/conversation-partner/${reqId}`
                } else if (request.program === 'OPT Request') {
                    endpoint = `http://localhost:8000/api/opt-requests/${reqId}`
                } else if (request.program === 'Document Request') {
                    endpoint = `http://localhost:8000/api/document-requests/${reqId}`
                } else if (request.program === 'English Language Program Volunteer') {
                    endpoint = `http://localhost:8000/api/english-language-volunteer/${reqId}`
                } else if (request.program === 'Off Campus Housing Application') {
                    endpoint = `http://localhost:8000/api/off-campus-housing/${reqId}`
                } else {
                    endpoint = `http://localhost:8000/api/i20-requests/${reqId}`
                }

                return fetch(endpoint, { method: 'DELETE' })
            })

            const responses = await Promise.all(deletePromises)

            // Check if all deletions were successful
            const allSuccess = responses.every(res => res.ok)

            if (!allSuccess) {
                throw new Error('Some requests failed to delete')
            }

            console.log(`${selectedRequests.length} requests deleted successfully`)

            // Remove from local state
            setRequests(prev => prev.filter(req => !selectedRequests.includes(req.id)))
            setSelectedRequests([])
            setDeleteSuccess(true)

            // Hide success message after 3 seconds
            setTimeout(() => {
                setDeleteSuccess(false)
            }, 3000)

        } catch (err) {
            console.error('Error deleting selected requests:', err)
            setError(`Failed to delete selected requests: ${err.message}`)
        } finally {
            setIsDeleting(false)
        }
    }

    // Function to delete all requests
    const deleteAllRequests = async () => {
        try {
            setIsDeleting(true)
            setError(null)
            setDeleteSuccess(false)

            // Delete from all endpoints
            const [i20Response, academicResponse, administrativeResponse, conversationResponse, optResponse, documentResponse, volunteerResponse, housingResponse] = await Promise.all([
                fetch('http://localhost:8000/api/i20-requests/', { method: 'DELETE' }),
                fetch('http://localhost:8000/api/academic-training/', { method: 'DELETE' }),
                fetch('http://localhost:8000/api/administrative-record/', { method: 'DELETE' }),
                fetch('http://localhost:8000/api/conversation-partner/', { method: 'DELETE' }),
                fetch('http://localhost:8000/api/opt-requests/', { method: 'DELETE' }),
                fetch('http://localhost:8000/api/document-requests/', { method: 'DELETE' }),
                fetch('http://localhost:8000/api/english-language-volunteer/', { method: 'DELETE' }),
                fetch('http://localhost:8000/api/off-campus-housing/', { method: 'DELETE' })
            ])

            if (!i20Response.ok || !academicResponse.ok || !administrativeResponse.ok || !conversationResponse.ok || !optResponse.ok || !documentResponse.ok || !volunteerResponse.ok || !housingResponse.ok) {
                const i20Error = i20Response.ok ? '' : await i20Response.text()
                const academicError = academicResponse.ok ? '' : await academicResponse.text()
                const adminError = administrativeResponse.ok ? '' : await administrativeResponse.text()
                const conversationError = conversationResponse.ok ? '' : await conversationResponse.text()
                const optError = optResponse.ok ? '' : await optResponse.text()
                const documentError = documentResponse.ok ? '' : await documentResponse.text()
                const volunteerError = volunteerResponse.ok ? '' : await volunteerResponse.text()
                const housingError = housingResponse.ok ? '' : await housingResponse.text()
                throw new Error(`Failed to delete requests: ${i20Error} ${academicError} ${adminError} ${conversationError} ${optError} ${documentError} ${volunteerError} ${housingError}`)
            }

            console.log('All requests deleted successfully')
            setDeleteSuccess(true)
            setRequests([]) // Clear the local state
            setSelectedRequests([])

            // Hide success message after 3 seconds
            setTimeout(() => {
                setDeleteSuccess(false)
            }, 3000)

        } catch (err) {
            console.error('Error deleting requests:', err)
            setError(`Failed to delete requests: ${err.message}`)
        } finally {
            setIsDeleting(false)
        }
    }

    // Toggle selection of a request
    const toggleSelection = (requestId) => {
        setSelectedRequests(prev => {
            if (prev.includes(requestId)) {
                return prev.filter(id => id !== requestId)
            } else {
                return [...prev, requestId]
            }
        })
    }

    // Toggle select all/none
    const toggleSelectAll = (requestsList) => {
        if (selectedRequests.length === requestsList.length && requestsList.length > 0) {
            setSelectedRequests([])
        } else {
            setSelectedRequests(requestsList.map(req => req.id))
        }
    }

    // View request details
    const viewRequest = (request) => {
        setSelectedRequest(request)
        setViewModalVisible(true)
    }

    // Close modal
    const closeModal = () => {
        setViewModalVisible(false)
        setSelectedRequest(null)
    }

    useEffect(() => {
        fetchRequests()
    }, [])

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        return date.toLocaleString()
    }

    // Format JSON with syntax highlighting
    const formatJSON = (jsonObj) => {
        if (!jsonObj) return 'N/A';

        // Convert JSON to string with proper indentation
        const jsonString = JSON.stringify(jsonObj, null, 2);

        // Apply syntax highlighting by wrapping different parts in spans with classes
        return jsonString
            .replace(/"([^"]+)":/g, '<span class="json-key">"$1"</span>:') // keys
            .replace(/"([^"]+)"(?!:)/g, '<span class="json-string">"$1"</span>') // strings
            .replace(/\b(true|false)\b/g, '<span class="json-boolean">$1</span>') // booleans
            .replace(/\b(null)\b/g, '<span class="json-null">$1</span>') // null
            .replace(/\b(\d+)\b/g, '<span class="json-number">$1</span>'); // numbers
    }

    // Filter requests by type
    const i20Requests = requests.filter(req =>
        req.program !== 'Academic Training' &&
        req.program !== 'Administrative Record Change' &&
        req.program !== 'Conversation Partner' &&
        req.program !== 'OPT Request' &&
        req.program !== 'Document Request' &&
        req.program !== 'English Language Program Volunteer' &&
        req.program !== 'Off Campus Housing Application'
    );
    const academicTrainingRequests = requests.filter(req => req.program === 'Academic Training');
    const administrativeRecordRequests = requests.filter(req => req.program === 'Administrative Record Change');
    const conversationPartnerRequests = requests.filter(req => req.program === 'Conversation Partner');
    const optRequests = requests.filter(req => req.program === 'OPT Request');
    const documentRequests = requests.filter(req => req.program === 'Document Request');
    const volunteerRequests = requests.filter(req => req.program === 'English Language Program Volunteer');
    const housingRequests = requests.filter(req => req.program === 'Off Campus Housing Application');

    // Get request type
    const getRequestType = (request) => {
        if (request.program === 'Academic Training') {
            // Check both camelCase and snake_case for compatibility
            const completionType = request.form_data?.completion_type || request.form_data?.completionType;
            return completionType === 'pre' ? 'Academic Training: Pre-Completion' : 'Academic Training: Post-Completion';
        } else if (request.program === 'Administrative Record Change') {
            // Display the first action requested, or show all if multiple
            const actions = request.form_data?.actionRequested || request.form_data?.action_requested;
            if (actions && actions.length > 0) {
                return actions.length === 1
                    ? `Admin Record: ${actions[0]}`
                    : `Admin Record: ${actions.join(', ')}`;
            }
            return 'Administrative Record Change';
        } else if (request.program === 'Conversation Partner') {
            const academicLevel = request.form_data?.academic_level || 'N/A';
            return `Conversation Partner: ${academicLevel}`;
        } else if (request.program === 'OPT Request') {
            const academicLevel = request.form_data?.academic_level || 'N/A';
            return `OPT Request: ${academicLevel}`;
        } else if (request.program === 'Document Request') {
            const documentType = request.form_data?.global_student_document || request.form_data?.undergrad_document || 'N/A';
            return `Document Request: ${documentType}`;
        } else if (request.program === 'English Language Program Volunteer') {
            const academicLevel = request.form_data?.academic_level || 'N/A';
            return `English Language Volunteer: ${academicLevel}`;
        } else if (request.program === 'Off Campus Housing Application') {
            const paymentStatus = request.form_data?.payment_status || 'PENDING';
            return `Off Campus Housing: ${paymentStatus}`;
        } else {
            return request.program;
        }
    };

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader className="bg-primary text-white">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <strong>All Form Submissions</strong>
                                <small className="ms-2 text-white">View all submitted requests</small>
                            </div>
                            <div className="d-flex gap-2">
                                {selectedRequests.length > 0 && (
                                    <CButton
                                        color="warning"
                                        size="sm"
                                        onClick={deleteSelectedRequests}
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? <><CSpinner size="sm" /> Deleting...</> : `Delete Selected (${selectedRequests.length})`}
                                    </CButton>
                                )}
                                <CButton
                                    color="light"
                                    size="sm"
                                    onClick={deleteAllRequests}
                                    disabled={isDeleting || requests.length === 0}
                                >
                                    {isDeleting ? <><CSpinner size="sm" /> Deleting...</> : 'Delete All'}
                                </CButton>
                            </div>
                        </div>
                    </CCardHeader>
                    <CCardBody>
                        {error && <CAlert color="danger">{error}</CAlert>}
                        {deleteSuccess && <CAlert color="success">All requests have been successfully deleted.</CAlert>}

                        {loading ? (
                            <div className="d-flex justify-content-center">
                                <CSpinner color="primary" />
                            </div>
                        ) : requests.length === 0 ? (
                            <CAlert color="info">No requests found.</CAlert>
                        ) : (
                            <>
                                <CNav variant="tabs" role="tablist" className="mb-3">
                                    <CNavItem>
                                        <CNavLink
                                            active={activeTab === 1}
                                            onClick={() => setActiveTab(1)}
                                            role="tab"
                                        >
                                            All Requests ({requests.length})
                                        </CNavLink>
                                    </CNavItem>
                                    <CNavItem>
                                        <CNavLink
                                            active={activeTab === 2}
                                            onClick={() => setActiveTab(2)}
                                            role="tab"
                                        >
                                            I-20 Requests ({i20Requests.length})
                                        </CNavLink>
                                    </CNavItem>
                                    <CNavItem>
                                        <CNavLink
                                            active={activeTab === 3}
                                            onClick={() => setActiveTab(3)}
                                            role="tab"
                                        >
                                            Academic Training ({academicTrainingRequests.length})
                                        </CNavLink>
                                    </CNavItem>
                                    <CNavItem>
                                        <CNavLink
                                            active={activeTab === 4}
                                            onClick={() => setActiveTab(4)}
                                            role="tab"
                                        >
                                            Administrative Record ({administrativeRecordRequests.length})
                                        </CNavLink>
                                    </CNavItem>
                                    <CNavItem>
                                        <CNavLink
                                            active={activeTab === 5}
                                            onClick={() => setActiveTab(5)}
                                            role="tab"
                                        >
                                            Conversation Partner ({conversationPartnerRequests.length})
                                        </CNavLink>
                                    </CNavItem>
                                    <CNavItem>
                                        <CNavLink
                                            active={activeTab === 6}
                                            onClick={() => setActiveTab(6)}
                                            role="tab"
                                        >
                                            OPT Requests ({optRequests.length})
                                        </CNavLink>
                                    </CNavItem>
                                    <CNavItem>
                                        <CNavLink
                                            active={activeTab === 7}
                                            onClick={() => setActiveTab(7)}
                                            role="tab"
                                        >
                                            Document Requests ({documentRequests.length})
                                        </CNavLink>
                                    </CNavItem>
                                    <CNavItem>
                                        <CNavLink
                                            active={activeTab === 8}
                                            onClick={() => setActiveTab(8)}
                                            role="tab"
                                        >
                                            English Language Volunteer ({volunteerRequests.length})
                                        </CNavLink>
                                    </CNavItem>
                                    <CNavItem>
                                        <CNavLink
                                            active={activeTab === 9}
                                            onClick={() => setActiveTab(9)}
                                            role="tab"
                                        >
                                            Off Campus Housing ({housingRequests.length})
                                        </CNavLink>
                                    </CNavItem>
                                </CNav>

                                <CTabContent>
                                    <CTabPane role="tabpanel" visible={activeTab === 1}>
                                        <CTable hover responsive>
                                            <CTableHead>
                                                <CTableRow>
                                                    <CTableHeaderCell scope="col">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedRequests.length === requests.length && requests.length > 0}
                                                            onChange={() => toggleSelectAll(requests)}
                                                        />
                                                    </CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Form Type</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Student Name</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Student ID</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Submission Date</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                                                </CTableRow>
                                            </CTableHead>
                                            <CTableBody>
                                                {requests.map((request) => (
                                                    <CTableRow key={request.id}>
                                                        <CTableDataCell>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedRequests.includes(request.id)}
                                                                onChange={() => toggleSelection(request.id)}
                                                            />
                                                        </CTableDataCell>
                                                        <CTableHeaderCell scope="row">{request.id}</CTableHeaderCell>
                                                        <CTableDataCell>{getRequestType(request)}</CTableDataCell>
                                                        <CTableDataCell>{request.student_name}</CTableDataCell>
                                                        <CTableDataCell>{request.student_id}</CTableDataCell>
                                                        <CTableDataCell>{formatDate(request.submission_date)}</CTableDataCell>
                                                        <CTableDataCell>
                                                            <span className={`badge bg-${request.status === 'pending' ? 'warning' : 'success'}`}>
                                                                {request.status}
                                                            </span>
                                                        </CTableDataCell>
                                                        <CTableDataCell>
                                                            <CButton
                                                                size="sm"
                                                                color="danger"
                                                                className="me-2"
                                                                onClick={() => deleteRequest(request.id, request.program)}
                                                                disabled={isDeleting}
                                                            >
                                                                Delete
                                                            </CButton>
                                                            <CButton
                                                                size="sm"
                                                                color="primary"
                                                                onClick={() => viewRequest(request)}
                                                            >
                                                                View
                                                            </CButton>
                                                        </CTableDataCell>
                                                    </CTableRow>
                                                ))}
                                            </CTableBody>
                                        </CTable>
                                    </CTabPane>

                                    <CTabPane role="tabpanel" visible={activeTab === 2}>
                                        <CTable hover responsive>
                                            <CTableHead>
                                                <CTableRow>
                                                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Student Name</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Student ID</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Program</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Submission Date</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                                                </CTableRow>
                                            </CTableHead>
                                            <CTableBody>
                                                {i20Requests.map((request) => (
                                                    <CTableRow key={request.id}>
                                                        <CTableHeaderCell scope="row">{request.id}</CTableHeaderCell>
                                                        <CTableDataCell>{request.student_name}</CTableDataCell>
                                                        <CTableDataCell>{request.student_id}</CTableDataCell>
                                                        <CTableDataCell>{request.program}</CTableDataCell>
                                                        <CTableDataCell>{formatDate(request.submission_date)}</CTableDataCell>
                                                        <CTableDataCell>
                                                            <span className={`badge bg-${request.status === 'pending' ? 'warning' : 'success'}`}>
                                                                {request.status}
                                                            </span>
                                                        </CTableDataCell>
                                                        <CTableDataCell>
                                                            <CButton
                                                                size="sm"
                                                                color="primary"
                                                                onClick={() => viewRequest(request)}
                                                            >
                                                                View
                                                            </CButton>
                                                        </CTableDataCell>
                                                    </CTableRow>
                                                ))}
                                            </CTableBody>
                                        </CTable>
                                    </CTabPane>

                                    <CTabPane role="tabpanel" visible={activeTab === 3}>
                                        <CTable hover responsive>
                                            <CTableHead>
                                                <CTableRow>
                                                    <CTableHeaderCell scope="col">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedRequests.length === academicTrainingRequests.length && academicTrainingRequests.length > 0}
                                                            onChange={() => toggleSelectAll(academicTrainingRequests)}
                                                        />
                                                    </CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Student Name</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Student ID</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Type</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Submission Date</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                                                </CTableRow>
                                            </CTableHead>
                                            <CTableBody>
                                                {academicTrainingRequests.map((request) => (
                                                    <CTableRow key={request.id}>
                                                        <CTableDataCell>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedRequests.includes(request.id)}
                                                                onChange={() => toggleSelection(request.id)}
                                                            />
                                                        </CTableDataCell>
                                                        <CTableHeaderCell scope="row">{request.id}</CTableHeaderCell>
                                                        <CTableDataCell>{request.student_name}</CTableDataCell>
                                                        <CTableDataCell>{request.student_id}</CTableDataCell>
                                                        <CTableDataCell>
                                                            {(request.form_data?.completion_type || request.form_data?.completionType) === 'pre' ? 'Pre-Completion' : 'Post-Completion'}
                                                        </CTableDataCell>
                                                        <CTableDataCell>{formatDate(request.submission_date)}</CTableDataCell>
                                                        <CTableDataCell>
                                                            <span className={`badge bg-${request.status === 'pending' ? 'warning' : 'success'}`}>
                                                                {request.status}
                                                            </span>
                                                        </CTableDataCell>
                                                        <CTableDataCell>
                                                            <CButton
                                                                size="sm"
                                                                color="danger"
                                                                className="me-2"
                                                                onClick={() => deleteRequest(request.id, request.program)}
                                                                disabled={isDeleting}
                                                            >
                                                                Delete
                                                            </CButton>
                                                            <CButton
                                                                size="sm"
                                                                color="primary"
                                                                onClick={() => viewRequest(request)}
                                                            >
                                                                View
                                                            </CButton>
                                                        </CTableDataCell>
                                                    </CTableRow>
                                                ))}
                                            </CTableBody>
                                        </CTable>
                                    </CTabPane>

                                    <CTabPane role="tabpanel" visible={activeTab === 4}>
                                        <CTable hover responsive>
                                            <CTableHead>
                                                <CTableRow>
                                                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Student Name</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Student ID</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Action Requested</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Submission Date</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                                                </CTableRow>
                                            </CTableHead>
                                            <CTableBody>
                                                {administrativeRecordRequests.map((request) => (
                                                    <CTableRow key={request.id}>
                                                        <CTableHeaderCell scope="row">{request.id}</CTableHeaderCell>
                                                        <CTableDataCell>{request.student_name}</CTableDataCell>
                                                        <CTableDataCell>{request.student_id}</CTableDataCell>
                                                        <CTableDataCell>
                                                            {request.form_data?.actionRequested?.length > 0
                                                                ? request.form_data.actionRequested[0]
                                                                : 'N/A'}
                                                        </CTableDataCell>
                                                        <CTableDataCell>{formatDate(request.submission_date)}</CTableDataCell>
                                                        <CTableDataCell>
                                                            <span className={`badge bg-${request.status === 'pending' ? 'warning' : 'success'}`}>
                                                                {request.status}
                                                            </span>
                                                        </CTableDataCell>
                                                        <CTableDataCell>
                                                            <CButton
                                                                size="sm"
                                                                color="primary"
                                                                onClick={() => viewRequest(request)}
                                                            >
                                                                View
                                                            </CButton>
                                                        </CTableDataCell>
                                                    </CTableRow>
                                                ))}
                                            </CTableBody>
                                        </CTable>
                                    </CTabPane>

                                    <CTabPane role="tabpanel" visible={activeTab === 5}>
                                        <CTable hover responsive>
                                            <CTableHead>
                                                <CTableRow>
                                                    <CTableHeaderCell scope="col">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedRequests.length === conversationPartnerRequests.length && conversationPartnerRequests.length > 0}
                                                            onChange={() => toggleSelectAll(conversationPartnerRequests)}
                                                        />
                                                    </CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Student Name</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Student ID</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Academic Level</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Major</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Submission Date</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                                                </CTableRow>
                                            </CTableHead>
                                            <CTableBody>
                                                {conversationPartnerRequests.map((request) => (
                                                    <CTableRow key={request.id}>
                                                        <CTableDataCell>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedRequests.includes(request.id)}
                                                                onChange={() => toggleSelection(request.id)}
                                                            />
                                                        </CTableDataCell>
                                                        <CTableHeaderCell scope="row">{request.id}</CTableHeaderCell>
                                                        <CTableDataCell>{request.student_name}</CTableDataCell>
                                                        <CTableDataCell>{request.student_id}</CTableDataCell>
                                                        <CTableDataCell>
                                                            {request.form_data?.academic_level || 'N/A'}
                                                        </CTableDataCell>
                                                        <CTableDataCell>
                                                            {request.form_data?.major || 'N/A'}
                                                        </CTableDataCell>
                                                        <CTableDataCell>{formatDate(request.submission_date)}</CTableDataCell>
                                                        <CTableDataCell>
                                                            <span className={`badge bg-${request.status === 'pending' ? 'warning' : 'success'}`}>
                                                                {request.status}
                                                            </span>
                                                        </CTableDataCell>
                                                        <CTableDataCell>
                                                            <CButton
                                                                size="sm"
                                                                color="danger"
                                                                className="me-2"
                                                                onClick={() => deleteRequest(request.id, request.program)}
                                                                disabled={isDeleting}
                                                            >
                                                                Delete
                                                            </CButton>
                                                            <CButton
                                                                size="sm"
                                                                color="primary"
                                                                onClick={() => viewRequest(request)}
                                                            >
                                                                View
                                                            </CButton>
                                                        </CTableDataCell>
                                                    </CTableRow>
                                                ))}
                                            </CTableBody>
                                        </CTable>
                                    </CTabPane>

                                    <CTabPane role="tabpanel" visible={activeTab === 6}>
                                        <CTable hover responsive>
                                            <CTableHead>
                                                <CTableRow>
                                                    <CTableHeaderCell scope="col">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedRequests.length === optRequests.length && optRequests.length > 0}
                                                            onChange={() => toggleSelectAll(optRequests)}
                                                        />
                                                    </CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Student Name</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Student ID</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Academic Level</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Academic Program</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Submission Date</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                                                </CTableRow>
                                            </CTableHead>
                                            <CTableBody>
                                                {optRequests.map((request) => (
                                                    <CTableRow key={request.id}>
                                                        <CTableDataCell>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedRequests.includes(request.id)}
                                                                onChange={() => toggleSelection(request.id)}
                                                            />
                                                        </CTableDataCell>
                                                        <CTableHeaderCell scope="row">{request.id}</CTableHeaderCell>
                                                        <CTableDataCell>{request.student_name}</CTableDataCell>
                                                        <CTableDataCell>{request.student_id}</CTableDataCell>
                                                        <CTableDataCell>
                                                            {request.form_data?.academic_level || 'N/A'}
                                                        </CTableDataCell>
                                                        <CTableDataCell>
                                                            {request.form_data?.academic_program || 'N/A'}
                                                        </CTableDataCell>
                                                        <CTableDataCell>{formatDate(request.submission_date)}</CTableDataCell>
                                                        <CTableDataCell>
                                                            <span className={`badge bg-${request.status === 'pending' ? 'warning' : 'success'}`}>
                                                                {request.status}
                                                            </span>
                                                        </CTableDataCell>
                                                        <CTableDataCell>
                                                            <CButton
                                                                size="sm"
                                                                color="danger"
                                                                className="me-2"
                                                                onClick={() => deleteRequest(request.id, request.program)}
                                                                disabled={isDeleting}
                                                            >
                                                                Delete
                                                            </CButton>
                                                            <CButton
                                                                size="sm"
                                                                color="primary"
                                                                onClick={() => viewRequest(request)}
                                                            >
                                                                View
                                                            </CButton>
                                                        </CTableDataCell>
                                                    </CTableRow>
                                                ))}
                                            </CTableBody>
                                        </CTable>
                                    </CTabPane>

                                    <CTabPane role="tabpanel" visible={activeTab === 7}>
                                        <CTable hover responsive>
                                            <CTableHead>
                                                <CTableRow>
                                                    <CTableHeaderCell scope="col">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedRequests.length === documentRequests.length && documentRequests.length > 0}
                                                            onChange={() => toggleSelectAll(documentRequests)}
                                                        />
                                                    </CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Student Name</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Student ID</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Document Type</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Delivery Format</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Submission Date</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                                                </CTableRow>
                                            </CTableHead>
                                            <CTableBody>
                                                {documentRequests.map((request) => (
                                                    <CTableRow key={request.id}>
                                                        <CTableDataCell>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedRequests.includes(request.id)}
                                                                onChange={() => toggleSelection(request.id)}
                                                            />
                                                        </CTableDataCell>
                                                        <CTableHeaderCell scope="row">{request.id}</CTableHeaderCell>
                                                        <CTableDataCell>{request.student_name}</CTableDataCell>
                                                        <CTableDataCell>{request.student_id}</CTableDataCell>
                                                        <CTableDataCell>
                                                            {request.form_data?.global_student_document || request.form_data?.undergrad_document || 'N/A'}
                                                        </CTableDataCell>
                                                        <CTableDataCell>
                                                            {request.form_data?.format || 'N/A'}
                                                        </CTableDataCell>
                                                        <CTableDataCell>{formatDate(request.submission_date)}</CTableDataCell>
                                                        <CTableDataCell>
                                                            <span className={`badge bg-${request.status === 'pending' ? 'warning' : 'success'}`}>
                                                                {request.status}
                                                            </span>
                                                        </CTableDataCell>
                                                        <CTableDataCell>
                                                            <CButton
                                                                size="sm"
                                                                color="danger"
                                                                className="me-2"
                                                                onClick={() => deleteRequest(request.id, request.program)}
                                                                disabled={isDeleting}
                                                            >
                                                                Delete
                                                            </CButton>
                                                            <CButton
                                                                size="sm"
                                                                color="primary"
                                                                onClick={() => viewRequest(request)}
                                                            >
                                                                View
                                                            </CButton>
                                                        </CTableDataCell>
                                                    </CTableRow>
                                                ))}
                                            </CTableBody>
                                        </CTable>
                                    </CTabPane>

                                    <CTabPane role="tabpanel" visible={activeTab === 8}>
                                        <CTable hover responsive>
                                            <CTableHead>
                                                <CTableRow>
                                                    <CTableHeaderCell scope="col">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedRequests.length === volunteerRequests.length && volunteerRequests.length > 0}
                                                            onChange={() => toggleSelectAll(volunteerRequests)}
                                                        />
                                                    </CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Student Name</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Student ID</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Academic Level</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Position</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Submission Date</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                                                </CTableRow>
                                            </CTableHead>
                                            <CTableBody>
                                                {volunteerRequests.map((request) => (
                                                    <CTableRow key={request.id}>
                                                        <CTableDataCell>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedRequests.includes(request.id)}
                                                                onChange={() => toggleSelection(request.id)}
                                                            />
                                                        </CTableDataCell>
                                                        <CTableHeaderCell scope="row">{request.id}</CTableHeaderCell>
                                                        <CTableDataCell>{request.student_name}</CTableDataCell>
                                                        <CTableDataCell>{request.student_id}</CTableDataCell>
                                                        <CTableDataCell>
                                                            {request.form_data?.academic_level || 'N/A'}
                                                        </CTableDataCell>
                                                        <CTableDataCell>
                                                            {request.form_data?.position_intensive_english && request.form_data?.position_online_english
                                                                ? 'Both'
                                                                : request.form_data?.position_intensive_english
                                                                    ? 'Intensive English'
                                                                    : request.form_data?.position_online_english
                                                                        ? 'Online English'
                                                                        : 'N/A'}
                                                        </CTableDataCell>
                                                        <CTableDataCell>{formatDate(request.submission_date)}</CTableDataCell>
                                                        <CTableDataCell>
                                                            <span className={`badge bg-${request.status === 'pending' ? 'warning' : 'success'}`}>
                                                                {request.status}
                                                            </span>
                                                        </CTableDataCell>
                                                        <CTableDataCell>
                                                            <CButton
                                                                size="sm"
                                                                color="danger"
                                                                className="me-2"
                                                                onClick={() => deleteRequest(request.id, request.program)}
                                                                disabled={isDeleting}
                                                            >
                                                                Delete
                                                            </CButton>
                                                            <CButton
                                                                size="sm"
                                                                color="primary"
                                                                onClick={() => viewRequest(request)}
                                                            >
                                                                View
                                                            </CButton>
                                                        </CTableDataCell>
                                                    </CTableRow>
                                                ))}
                                            </CTableBody>
                                        </CTable>
                                    </CTabPane>

                                    <CTabPane role="tabpanel" visible={activeTab === 9}>
                                        <CTable hover responsive>
                                            <CTableHead>
                                                <CTableRow>
                                                    <CTableHeaderCell scope="col">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedRequests.length === housingRequests.length && housingRequests.length > 0}
                                                            onChange={() => toggleSelectAll(housingRequests)}
                                                        />
                                                    </CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Student Name</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Student ID</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Program Type</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Payment Status</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Submission Date</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                                                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                                                </CTableRow>
                                            </CTableHead>
                                            <CTableBody>
                                                {housingRequests.map((request) => (
                                                    <CTableRow key={request.id}>
                                                        <CTableDataCell>
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedRequests.includes(request.id)}
                                                                onChange={() => toggleSelection(request.id)}
                                                            />
                                                        </CTableDataCell>
                                                        <CTableHeaderCell scope="row">{request.id}</CTableHeaderCell>
                                                        <CTableDataCell>{request.student_name}</CTableDataCell>
                                                        <CTableDataCell>{request.student_id}</CTableDataCell>
                                                        <CTableDataCell>
                                                            {request.form_data?.program_type || 'N/A'}
                                                        </CTableDataCell>
                                                        <CTableDataCell>
                                                            <span className={`badge bg-${request.form_data?.payment_status === 'PAID' ? 'success' : 'warning'}`}>
                                                                {request.form_data?.payment_status || 'PENDING'}
                                                            </span>
                                                        </CTableDataCell>
                                                        <CTableDataCell>{formatDate(request.submission_date)}</CTableDataCell>
                                                        <CTableDataCell>
                                                            <span className={`badge bg-${request.status === 'pending' ? 'warning' : 'success'}`}>
                                                                {request.status}
                                                            </span>
                                                        </CTableDataCell>
                                                        <CTableDataCell>
                                                            <CButton
                                                                size="sm"
                                                                color="danger"
                                                                className="me-2"
                                                                onClick={() => deleteRequest(request.id, request.program)}
                                                                disabled={isDeleting}
                                                            >
                                                                Delete
                                                            </CButton>
                                                            <CButton
                                                                size="sm"
                                                                color="primary"
                                                                onClick={() => viewRequest(request)}
                                                            >
                                                                View
                                                            </CButton>
                                                        </CTableDataCell>
                                                    </CTableRow>
                                                ))}
                                            </CTableBody>
                                        </CTable>
                                    </CTabPane>
                                </CTabContent>

                                <h4 className="mt-4">Detailed Request Data</h4>
                                <CAccordion>
                                    {requests.map((request) => (
                                        <CAccordionItem key={request.id} itemKey={request.id}>
                                            <CAccordionHeader>
                                                {request.program === 'Academic Training'
                                                    ? 'Academic Training'
                                                    : request.program === 'Administrative Record Change'
                                                        ? 'Administrative Record'
                                                        : request.program === 'Conversation Partner'
                                                            ? 'Conversation Partner'
                                                            : request.program === 'OPT Request'
                                                                ? 'OPT Request'
                                                                : request.program === 'Document Request'
                                                                    ? 'Document Request'
                                                                    : request.program === 'English Language Program Volunteer'
                                                                        ? 'English Language Volunteer'
                                                                        : request.program === 'Off Campus Housing Application'
                                                                            ? 'Off Campus Housing'
                                                                            : 'I-20'} Request #{request.id} - {request.student_name}
                                            </CAccordionHeader>
                                            <CAccordionBody>
                                                <h5>Basic Information</h5>
                                                <CTable small>
                                                    <CTableBody>
                                                        <CTableRow>
                                                            <CTableHeaderCell>Form Type</CTableHeaderCell>
                                                            <CTableDataCell>{getRequestType(request)}</CTableDataCell>
                                                        </CTableRow>
                                                        <CTableRow>
                                                            <CTableHeaderCell>Student Name</CTableHeaderCell>
                                                            <CTableDataCell>{request.student_name}</CTableDataCell>
                                                        </CTableRow>
                                                        <CTableRow>
                                                            <CTableHeaderCell>Student ID</CTableHeaderCell>
                                                            <CTableDataCell>{request.student_id}</CTableDataCell>
                                                        </CTableRow>
                                                        <CTableRow>
                                                            <CTableHeaderCell>Submission Date</CTableHeaderCell>
                                                            <CTableDataCell>{formatDate(request.submission_date)}</CTableDataCell>
                                                        </CTableRow>
                                                        <CTableRow>
                                                            <CTableHeaderCell>Status</CTableHeaderCell>
                                                            <CTableDataCell>{request.status}</CTableDataCell>
                                                        </CTableRow>
                                                    </CTableBody>
                                                </CTable>

                                                <h5 className="mt-4">Complete Form Data</h5>
                                                {request.form_data ? (
                                                    <div className="json-data-container p-3 rounded"
                                                        style={{
                                                            backgroundColor: 'var(--cui-dark)',
                                                            border: '1px solid var(--cui-border-color)'
                                                        }}>
                                                        <pre
                                                            style={{
                                                                whiteSpace: 'pre-wrap',
                                                                color: 'var(--cui-body-color)',
                                                                backgroundColor: 'transparent',
                                                                fontFamily: 'var(--cui-font-monospace)',
                                                                fontSize: '0.9rem',
                                                                overflowX: 'auto',
                                                                margin: 0
                                                            }}
                                                            dangerouslySetInnerHTML={{ __html: formatJSON(request.form_data) }}
                                                        ></pre>
                                                    </div>
                                                ) : (
                                                    <CAlert color="warning">No detailed form data available</CAlert>
                                                )}
                                            </CAccordionBody>
                                        </CAccordionItem>
                                    ))}
                                </CAccordion>
                            </>
                        )}
                    </CCardBody>
                </CCard>
            </CCol>

            {/* View Request Modal */}
            <CModal visible={viewModalVisible} onClose={closeModal} size="xl" scrollable>
                <CModalHeader>
                    <CModalTitle>
                        {selectedRequest && (
                            <>
                                {selectedRequest.program === 'Academic Training'
                                    ? 'Academic Training Request'
                                    : selectedRequest.program === 'Administrative Record Change'
                                        ? 'Administrative Record Change'
                                        : selectedRequest.program === 'Conversation Partner'
                                            ? 'Conversation Partner Application'
                                            : selectedRequest.program === 'OPT Request'
                                                ? 'OPT Request Application'
                                                : selectedRequest.program === 'Document Request'
                                                    ? 'Document Request'
                                                    : selectedRequest.program === 'English Language Program Volunteer'
                                                        ? 'English Language Program Volunteer'
                                                        : selectedRequest.program === 'Off Campus Housing Application'
                                                            ? 'Off Campus Housing Application'
                                                            : 'I-20 Request'} #{selectedRequest.id}
                            </>
                        )}
                    </CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {selectedRequest && (
                        <>
                            <h5 className="border-bottom pb-2 mb-3">Basic Information</h5>
                            <CTable small bordered>
                                <CTableBody>
                                    <CTableRow>
                                        <CTableHeaderCell style={{ width: '30%' }}>Request ID</CTableHeaderCell>
                                        <CTableDataCell>{selectedRequest.id}</CTableDataCell>
                                    </CTableRow>
                                    <CTableRow>
                                        <CTableHeaderCell>Form Type</CTableHeaderCell>
                                        <CTableDataCell>{getRequestType(selectedRequest)}</CTableDataCell>
                                    </CTableRow>
                                    <CTableRow>
                                        <CTableHeaderCell>Student Name</CTableHeaderCell>
                                        <CTableDataCell>{selectedRequest.student_name}</CTableDataCell>
                                    </CTableRow>
                                    <CTableRow>
                                        <CTableHeaderCell>Student ID</CTableHeaderCell>
                                        <CTableDataCell>{selectedRequest.student_id}</CTableDataCell>
                                    </CTableRow>
                                    <CTableRow>
                                        <CTableHeaderCell>Program</CTableHeaderCell>
                                        <CTableDataCell>{selectedRequest.program}</CTableDataCell>
                                    </CTableRow>
                                    <CTableRow>
                                        <CTableHeaderCell>Submission Date</CTableHeaderCell>
                                        <CTableDataCell>{formatDate(selectedRequest.submission_date)}</CTableDataCell>
                                    </CTableRow>
                                    <CTableRow>
                                        <CTableHeaderCell>Status</CTableHeaderCell>
                                        <CTableDataCell>
                                            <span className={`badge bg-${selectedRequest.status === 'pending' ? 'warning' : 'success'}`}>
                                                {selectedRequest.status}
                                            </span>
                                        </CTableDataCell>
                                    </CTableRow>
                                    {selectedRequest.program === 'Academic Training' && selectedRequest.form_data && (
                                        <>
                                            {selectedRequest.form_data.offer_letter_path && (
                                                <CTableRow>
                                                    <CTableHeaderCell>Offer Letter</CTableHeaderCell>
                                                    <CTableDataCell>
                                                        <code>{selectedRequest.form_data.offer_letter_path}</code>
                                                    </CTableDataCell>
                                                </CTableRow>
                                            )}
                                            {selectedRequest.form_data.training_authorization_path && (
                                                <CTableRow>
                                                    <CTableHeaderCell>Training Authorization</CTableHeaderCell>
                                                    <CTableDataCell>
                                                        <code>{selectedRequest.form_data.training_authorization_path}</code>
                                                    </CTableDataCell>
                                                </CTableRow>
                                            )}
                                        </>
                                    )}
                                </CTableBody>
                            </CTable>

                            <h5 className="border-bottom pb-2 mb-3 mt-4">Complete Form Data</h5>
                            {selectedRequest.form_data ? (
                                <div className="json-data-container p-3 rounded"
                                    style={{
                                        backgroundColor: '#2d3238',
                                        border: '1px solid #444'
                                    }}>
                                    <pre
                                        style={{
                                            whiteSpace: 'pre-wrap',
                                            color: '#e8e8e8',
                                            backgroundColor: 'transparent',
                                            fontFamily: 'monospace',
                                            fontSize: '0.85rem',
                                            overflowX: 'auto',
                                            margin: 0
                                        }}
                                        dangerouslySetInnerHTML={{ __html: formatJSON(selectedRequest.form_data) }}
                                    ></pre>
                                </div>
                            ) : (
                                <CAlert color="warning">No detailed form data available</CAlert>
                            )}

                            {selectedRequest.comments && (
                                <>
                                    <h5 className="border-bottom pb-2 mb-3 mt-4">Comments</h5>
                                    <div className="p-3 bg-light rounded">
                                        <p className="mb-0">{selectedRequest.comments}</p>
                                    </div>
                                </>
                            )}

                            {selectedRequest.other_reason && (
                                <>
                                    <h5 className="border-bottom pb-2 mb-3 mt-4">Other Reason</h5>
                                    <div className="p-3 bg-light rounded">
                                        <p className="mb-0">{selectedRequest.other_reason}</p>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton
                        color="danger"
                        onClick={() => {
                            closeModal()
                            deleteRequest(selectedRequest.id, selectedRequest.program)
                        }}
                        disabled={isDeleting}
                    >
                        Delete Request
                    </CButton>
                    <CButton color="secondary" onClick={closeModal}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>
        </CRow>
    )
}
