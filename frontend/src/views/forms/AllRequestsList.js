// src/views/forms/AllRequestsList.js
import React, { useState, useEffect, useMemo } from 'react'
import {
    CCard, CCardBody, CCardHeader,
    CRow, CCol, CNav, CNavItem, CNavLink,
    CTabContent, CTabPane, CTable, CTableHead,
    CTableBody, CTableRow, CTableHeaderCell,
    CTableDataCell, CButton, CSpinner, CAlert,
    CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter
} from '@coreui/react'

// Custom hook for fetching requests
const useFetchRequests = () => {
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchAllRequests = async () => {
        try {
            const requestTypes = [
                { name: 'i20-requests', label: 'I-20' },
                { name: 'academic-training', label: 'Academic Training' },
                { name: 'administrative-record', label: 'Administrative Record' },
                { name: 'conversation-partner', label: 'Conversation Partner' },
                { name: 'opt-requests', label: 'OPT Request' },
                { name: 'document-requests', label: 'Document Request' },
                { name: 'english-language-volunteer', label: 'English Language Volunteer' },
                { name: 'off-campus-housing', label: 'Off Campus Housing' },
                { name: 'florida-statute-101035', label: 'Florida Statute 1010.35' },
                { name: 'leave-requests', label: 'Leave Request' },
                { name: 'opt-stem-reports', label: 'OPT STEM Extension Reporting' },
                { name: 'opt-stem-applications', label: 'OPT STEM Extension Application' },
                { name: 'exit-forms', label: 'Exit Form' },
                { name: 'pathway-programs-intent-to-progress', label: 'Pathway Programs Intent to Progress' },
                { name: 'pathway-programs-next-steps', label: 'Pathway Programs Next Steps' },
                { name: 'reduced-course-load', label: 'Reduced Course Load Request' },
                { name: 'global-transfer-out', label: 'Global Transfer Out Request' }
            ]

            const responses = await Promise.all(
                requestTypes.map(type =>
                    fetch(`http://localhost:8000/api/${type.name}/`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`${type.label} HTTP error! Status: ${response.status}`)
                            }
                            return response.json()
                        })
                )
            )

            const allRequests = responses.flat()
            setRequests(allRequests)
            setError(null)
        } catch (err) {
            console.error('Error fetching requests:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAllRequests()
    }, [])

    return {
        requests,
        loading,
        error,
        setRequests,
        refetchRequests: fetchAllRequests
    }
}

// Reusable request filtering hook
const useRequestFilters = (requests) => {
    const requestFilters = {
        'I-20': req => req.program === 'I-20 Request',
        'Academic Training': req => req.program === 'Academic Training',
        'Administrative Record': req => req.program === 'Administrative Record Change',
        'Conversation Partner': req => req.program === 'Conversation Partner',
        'OPT Request': req => req.program === 'OPT Request',
        'Document Request': req => req.program === 'Document Request',
        'English Language Volunteer': req => req.program === 'English Language Program Volunteer',
        'Off Campus Housing': req => req.program === 'Off Campus Housing Application',
        'Florida Statute 1010.35': req => req.program === 'Florida Statute 1010.35',
        'Leave Request': req => req.program === 'Leave Request',
        'OPT STEM Extension Reporting': req => req.program === 'OPT STEM Extension Reporting',
        'OPT STEM Extension Application': req => req.program === 'OPT STEM Extension Application',
        'Exit Form': req => req.program === 'Exit Form',
        'Pathway Programs Intent to Progress': req => req.program === 'Pathway Programs Intent to Progress',
        'Pathway Programs Next Steps': req => req.program === 'Pathway Programs Next Steps',
        'Reduced Course Load Request': req => req.program === 'Reduced Course Load Request',
        'Global Transfer Out Request': req => req.program === 'Global Transfer Out Request'
    }

    return Object.entries(requestFilters).reduce((acc, [key, filter]) => {
        acc[key] = requests.filter(filter)
        return acc
    }, {})
}

// Reusable request type formatter
const formatRequestType = (request) => {
    const typeFormatters = {
        'Academic Training': req => {
            const completionType = req.form_data?.completion_type || req.form_data?.completionType
            return completionType === 'pre' ? 'Academic Training: Pre-Completion' : 'Academic Training: Post-Completion'
        },
        'Administrative Record Change': req => {
            const actions = req.form_data?.actionRequested || req.form_data?.action_requested
            return actions && actions.length > 0
                ? `Admin Record: ${actions.length === 1 ? actions[0] : actions.join(', ')}`
                : 'Administrative Record Change'
        },
        'Conversation Partner': req => `Conversation Partner: ${req.form_data?.academic_level || 'N/A'}`,
        'OPT Request': req => `OPT Request: ${req.form_data?.academic_level || 'N/A'}`,
        'Document Request': req => `Document Request: ${req.form_data?.global_student_document || req.form_data?.undergrad_document || 'N/A'}`,
        'English Language Program Volunteer': req => `English Language Volunteer: ${req.form_data?.academic_level || 'N/A'}`,
        'Off Campus Housing Application': req => `Off Campus Housing: ${req.form_data?.payment_status || 'PENDING'}`,
        'Florida Statute 1010.35': req => `Florida Statute 1010.35: ${req.form_data?.position || 'N/A'}`,
        'Leave Request': req => `Leave Request: ${req.form_data?.leave_type || 'N/A'}`,
        'OPT STEM Extension Reporting': req => {
            const reportType = []
            if (req.form_data?.standard_opt) reportType.push('Standard OPT')
            if (req.form_data?.stem_extension) reportType.push('STEM Extension')
            return `OPT STEM Report: ${reportType.length > 0 ? reportType.join(', ') : 'N/A'}`
        },
        'OPT STEM Extension Application': req => `OPT STEM Application: ${req.form_data?.academic_level || 'N/A'}`,
        'Exit Form': req => `Exit Form: ${req.form_data?.departure_reason || 'N/A'}`,
        'Pathway Programs Intent to Progress': () => `Pathway Programs Intent to Progress`,
        'Pathway Programs Next Steps': req => {
            const academicProgram = req.form_data?.academic_program || 'N/A';
            const academicTrack = req.form_data?.academic_track || 'N/A';
            return `Pathway Programs Next Steps: ${academicProgram} - ${academicTrack}`;
        },
        'Reduced Course Load Request': req => {
            const academicProgram = req.form_data?.academic_program_major || 'N/A';
            const rclTerm = req.form_data?.rcl_term || 'N/A';
            const rclYear = req.form_data?.rcl_year || 'N/A';
            return `Reduced Course Load: ${academicProgram} (${rclTerm} ${rclYear})`;
        },
        'Global Transfer Out Request': req => {
            const newSchool = req.form_data?.new_school_name || 'N/A';
            const startDate = req.form_data?.new_school_start_date || 'N/A';
            return `Transfer Out: ${newSchool} (${startDate})`;
        }
    }

    const formatter = typeFormatters[request.program] || (req => req.program)
    return formatter(request)
}

// Main component
export default function AllRequestsList() {
    const {
        requests,
        loading,
        error,
        setRequests,
        refetchRequests
    } = useFetchRequests()
    const filteredRequests = useRequestFilters(requests)
    const [activeTab, setActiveTab] = useState(1)
    const [selectedRequests, setSelectedRequests] = useState([])
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteError, setDeleteError] = useState(null)
    const [viewModalVisible, setViewModalVisible] = useState(false)
    const [selectedRequest, setSelectedRequest] = useState(null)

    // Determine the endpoint based on the request program
    const getDeleteEndpoint = (request) => {
        const programToEndpoint = {
            'Academic Training': `http://localhost:8000/api/academic-training/${request.id}`,
            'Administrative Record Change': `http://localhost:8000/api/administrative-record/${request.id}`,
            'Conversation Partner': `http://localhost:8000/api/conversation-partner/${request.id}`,
            'OPT Request': `http://localhost:8000/api/opt-requests/${request.id}`,
            'Document Request': `http://localhost:8000/api/document-requests/${request.id}`,
            'English Language Program Volunteer': `http://localhost:8000/api/english-language-volunteer/${request.id}`,
            'Off Campus Housing Application': `http://localhost:8000/api/off-campus-housing/${request.id}`,
            'Florida Statute 1010.35': `http://localhost:8000/api/florida-statute-101035/${request.id}`,
            'Leave Request': `http://localhost:8000/api/leave-requests/${request.id}`,
            'OPT STEM Extension Reporting': `http://localhost:8000/api/opt-stem-reports/${request.id}`,
            'OPT STEM Extension Application': `http://localhost:8000/api/opt-stem-applications/${request.id}`,
            'Exit Form': `http://localhost:8000/api/exit-forms/${request.id}`,
            'Pathway Programs Intent to Progress': `http://localhost:8000/api/pathway-programs-intent-to-progress/${request.id}`,
            'Pathway Programs Next Steps': `http://localhost:8000/api/pathway-programs-next-steps/${request.id}`,
            'Reduced Course Load Request': `http://localhost:8000/api/reduced-course-load/${request.id}`,
            'Global Transfer Out Request': `http://localhost:8000/api/global-transfer-out/${request.id}`,
            'I-20 Request': `http://localhost:8000/api/i20-requests/${request.id}`
        }

        return programToEndpoint[request.program] || `http://localhost:8000/api/i20-requests/${request.id}`
    }

    // Delete a single request
    const deleteRequest = async (request) => {
        if (!request) return

        try {
            setIsDeleting(true)
            setDeleteError(null)

            const endpoint = getDeleteEndpoint(request)
            const response = await fetch(endpoint, { method: 'DELETE' })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(`Failed to delete request: ${response.status} ${response.statusText} - ${errorText}`)
            }

            // Remove the request from the local state
            setRequests(prevRequests =>
                prevRequests.filter(req => req.id !== request.id)
            )

            // Remove from selected requests if it was selected
            setSelectedRequests(prevSelected =>
                prevSelected.filter(id => id !== request.id)
            )
        } catch (err) {
            console.error('Error deleting request:', err)
            setDeleteError(err.message)
        } finally {
            setIsDeleting(false)
            setViewModalVisible(false)
        }
    }

    // Delete multiple selected requests
    const deleteSelectedRequests = async () => {
        if (selectedRequests.length === 0) return

        try {
            setIsDeleting(true)
            setDeleteError(null)

            // Find the requests to delete
            const requestsToDelete = requests.filter(req =>
                selectedRequests.includes(req.id)
            )

            // Delete each request
            const deletePromises = requestsToDelete.map(async (request) => {
                const endpoint = getDeleteEndpoint(request)
                const response = await fetch(endpoint, { method: 'DELETE' })

                if (!response.ok) {
                    const errorText = await response.text()
                    throw new Error(`Failed to delete request ${request.id}: ${response.status} ${response.statusText} - ${errorText}`)
                }

                return request.id
            })

            // Wait for all deletions to complete
            await Promise.all(deletePromises)

            // Remove deleted requests from local state
            setRequests(prevRequests =>
                prevRequests.filter(req => !selectedRequests.includes(req.id))
            )

            // Clear selected requests
            setSelectedRequests([])
        } catch (err) {
            console.error('Error deleting selected requests:', err)
            setDeleteError(err.message)
        } finally {
            setIsDeleting(false)
        }
    }

    // Delete all requests
    const deleteAllRequests = async () => {
        try {
            setIsDeleting(true)
            setDeleteError(null)

            const requestTypes = [
                'i20-requests',
                'academic-training',
                'administrative-record',
                'conversation-partner',
                'opt-requests',
                'document-requests',
                'english-language-volunteer',
                'off-campus-housing',
                'florida-statute-101035',
                'leave-requests',
                'opt-stem-reports',
                'opt-stem-applications',
                'exit-forms',
                'pathway-programs-intent-to-progress',
                'pathway-programs-next-steps',
                'reduced-course-load'
            ]

            // Delete from all endpoints
            const deletePromises = requestTypes.map(type =>
                fetch(`http://localhost:8000/api/${type}/`, { method: 'DELETE' })
            )

            const responses = await Promise.all(deletePromises)

            // Check if all deletions were successful
            const allSuccess = responses.every(res => res.ok)
            if (!allSuccess) {
                const errorResponses = await Promise.all(
                    responses.map(async (res, index) => {
                        if (!res.ok) {
                            const errorText = await res.text()
                            return `${requestTypes[index]}: ${res.status} ${res.statusText} - ${errorText}`
                        }
                        return null
                    })
                )
                const errorMessages = errorResponses.filter(msg => msg !== null)
                throw new Error(`Some requests failed to delete:\n${errorMessages.join('\n')}`)
            }

            // Clear all requests from local state
            setRequests([])
            setSelectedRequests([])
        } catch (err) {
            console.error('Error deleting requests:', err)
            setDeleteError(err.message)
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

    // Toggle select all/none for a specific list of requests
    const toggleSelectAll = (requestsList) => {
        const requestIds = requestsList.map(req => req.id)

        setSelectedRequests(prev => {
            // If all requests are already selected, deselect all
            if (requestIds.every(id => prev.includes(id))) {
                return prev.filter(id => !requestIds.includes(id))
            }

            // Otherwise, select all requests
            return [...new Set([...prev, ...requestIds])]
        })
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

    // Render request table
    const renderRequestTable = (requestList, canSelect = true) => (
        <CTable hover responsive>
            <CTableHead>
                <CTableRow>
                    {canSelect && (
                        <CTableHeaderCell scope="col">
                            <input
                                type="checkbox"
                                checked={selectedRequests.length === requestList.length && requestList.length > 0}
                                onChange={() => toggleSelectAll(requestList)}
                            />
                        </CTableHeaderCell>
                    )}
                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Student Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Student ID</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Form Type</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Submission Date</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                </CTableRow>
            </CTableHead>
            <CTableBody>
                {requestList.map((request) => (
                    <CTableRow key={request.id}>
                        {canSelect && (
                            <CTableDataCell>
                                <input
                                    type="checkbox"
                                    checked={selectedRequests.includes(request.id)}
                                    onChange={() => toggleSelection(request.id)}
                                />
                            </CTableDataCell>
                        )}
                        <CTableHeaderCell scope="row">{request.id}</CTableHeaderCell>
                        <CTableDataCell>{request.student_name}</CTableDataCell>
                        <CTableDataCell>{request.student_id}</CTableDataCell>
                        <CTableDataCell>{formatRequestType(request)}</CTableDataCell>
                        <CTableDataCell>{new Date(request.submission_date).toLocaleString()}</CTableDataCell>
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
                                onClick={() => deleteRequest(request)}
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
    )

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
                        {deleteError && <CAlert color="danger">{deleteError}</CAlert>}
                        {loading ? (
                            <div className="d-flex justify-content-center">
                                <CSpinner color="primary" />
                            </div>
                        ) : error ? (
                            <CAlert color="danger">{error}</CAlert>
                        ) : requests.length === 0 ? (
                            <CAlert color="info">No requests found.</CAlert>
                        ) : (
                            <>
                                <CNav variant="tabs" role="tablist" className="mb-3">
                                    {Object.keys(filteredRequests).map((key, index) => (
                                        <CNavItem key={key}>
                                            <CNavLink
                                                active={activeTab === index + 1}
                                                onClick={() => setActiveTab(index + 1)}
                                                role="tab"
                                            >
                                                {key} ({filteredRequests[key].length})
                                            </CNavLink>
                                        </CNavItem>
                                    ))}
                                </CNav>

                                <CTabContent>
                                    {Object.entries(filteredRequests).map(([key, requestList], index) => (
                                        <CTabPane
                                            key={key}
                                            role="tabpanel"
                                            visible={activeTab === index + 1}
                                        >
                                            {renderRequestTable(requestList)}
                                        </CTabPane>
                                    ))}
                                </CTabContent>
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
                                {formatRequestType(selectedRequest)} #{selectedRequest.id}
                            </>
                        )}
                    </CModalTitle>
                </CModalHeader>
                {selectedRequest && (
                    <CModalBody>
                        <h5 className="border-bottom pb-2 mb-3">Request Details</h5>
                        <CTable small bordered>
                            <CTableBody>
                                <CTableRow>
                                    <CTableHeaderCell>ID</CTableHeaderCell>
                                    <CTableDataCell>{selectedRequest.id}</CTableDataCell>
                                </CTableRow>
                                <CTableRow>
                                    <CTableHeaderCell>Type</CTableHeaderCell>
                                    <CTableDataCell>{formatRequestType(selectedRequest)}</CTableDataCell>
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
                                    <CTableHeaderCell>Submission Date</CTableHeaderCell>
                                    <CTableDataCell>{new Date(selectedRequest.submission_date).toLocaleString()}</CTableDataCell>
                                </CTableRow>
                                <CTableRow>
                                    <CTableHeaderCell>Status</CTableHeaderCell>
                                    <CTableDataCell>
                                        <span className={`badge bg-${selectedRequest.status === 'pending' ? 'warning' : 'success'}`}>
                                            {selectedRequest.status}
                                        </span>
                                    </CTableDataCell>
                                </CTableRow>
                            </CTableBody>
                        </CTable>

                        <h5 className="border-bottom pb-2 mb-3 mt-4">Complete Form Data</h5>
                        {selectedRequest.form_data || selectedRequest.formData ? (
                            <div
                                className="json-data-container p-3 rounded"
                                style={{
                                    backgroundColor: '#2d3238',
                                    border: '1px solid #444'
                                }}
                            >
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
                                >
                                    {JSON.stringify(selectedRequest.form_data || selectedRequest.formData, null, 2)}
                                </pre>
                            </div>
                        ) : (
                            <CAlert color="warning">No detailed form data available</CAlert>
                        )}
                    </CModalBody>
                )}
                <CModalFooter>
                    <CButton
                        color="danger"
                        onClick={() => {
                            deleteRequest(selectedRequest)
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
