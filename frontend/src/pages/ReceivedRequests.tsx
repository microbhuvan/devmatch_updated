import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { FaEnvelopeOpen } from "react-icons/fa";

import ReceivedRequestCard from "../components/request/ReceivedRequestCard";
import ReceivedRequestCardSkeleton from "../components/request/ReceivedRequestCardSkeleton";

import {
  acceptRequest,
  getReceivedRequests,
  rejectRequest,
} from "../services/request.service";
import { useToast } from "../hooks/useToast";
import type { ReceivedRequest } from "../types/request.types";
import { decrementPendingRequestCount } from "../redux/slices/notificationSlice";

const ReceivedRequests = () => {
  const [requests, setRequests] = useState<ReceivedRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | false>(false);

  const dispatch = useDispatch();
  const toast = useToast();

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getReceivedRequests();
      setRequests(response.requests);
    } catch (err) {
      toast.error("Could not load requests. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const removeRequest = (requestId: string) => {
    setRequests((prev) => prev.filter((request) => request._id !== requestId));
    dispatch(decrementPendingRequestCount());
  };

  const handleAccept = async (requestId: string) => {
    try {
      setActionLoading(requestId);
      await acceptRequest(requestId);
      toast.success("Request accepted!");
      removeRequest(requestId);
    } catch (err) {
      toast.error("Failed to accept request. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      setActionLoading(requestId);
      await rejectRequest(requestId);
      toast.info("Request rejected.");
      removeRequest(requestId);
    } catch (err) {
      toast.error("Failed to reject request. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 p-6">
        <h1 className="mb-6 text-3xl font-bold">Pending Requests</h1>
        {[...Array(3)].map((_, i) => (
          <ReceivedRequestCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Pending Requests</h1>

      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-6 rounded-lg border-2 border-dashed border-base-300 py-20 text-center">
          <FaEnvelopeOpen className="text-7xl text-base-content/20" />
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold">No Pending Requests</h2>
            <p className="text-base-content/60">
              You're all caught up! New requests will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <ReceivedRequestCard
              key={request._id}
              request={request}
              onAccept={handleAccept}
              onReject={handleReject}
              loading={actionLoading === request._id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReceivedRequests;
