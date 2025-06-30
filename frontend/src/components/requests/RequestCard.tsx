import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Avatar,
  Chip,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Tooltip,
  Collapse,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  Done as DoneIcon,
  Close as CloseIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";

import { useRequests, type Request } from "@hooks/useRequests";

type RequestCardProps = {
  request: Request;
  type: "sent" | "received";
};

const RequestCard = ({ request, type }: RequestCardProps) => {
  const { updateStatus } = useRequests();

  const [expanded, setExpanded] = useState<boolean>(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState<boolean>(false);
  const [denyDialogOpen, setDenyDialogOpen] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleApproveClick = () => {
    setApproveDialogOpen(true);
  };

  const handleDenyClick = () => {
    setDenyDialogOpen(true);
  };

  const handleApproveConfirm = async () => {
    setApproveDialogOpen(false);
    setIsProcessing(true);

    try {
      await updateStatus(request.id, "approved");
    } catch (error) {
      console.error("Error approving request:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDenyConfirm = async () => {
    setDenyDialogOpen(false);
    setIsProcessing(true);

    try {
      await updateStatus(request.id, "denied");
    } catch (error) {
      console.error("Error denying request:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate status chip based on request status
  const getStatusChip = () => {
    switch (request.status) {
      case "pending":
        return (
          <Chip
            icon={<AccessTimeIcon />}
            label="Pending"
            size="small"
            color="warning"
          />
        );
      case "approved":
        return (
          <Chip
            icon={<CheckCircleIcon />}
            label="Approved"
            size="small"
            color="success"
          />
        );
      case "denied":
        return (
          <Chip
            icon={<CancelIcon />}
            label="Denied"
            size="small"
            color="error"
          />
        );
      case "completed":
        return (
          <Chip
            icon={<EmailIcon />}
            label="Completed"
            size="small"
            color="info"
          />
        );
      default:
        return null;
    }
  };

  // Generate avatar color based on name
  const stringToColor = (string: string): string => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  };

  const avatarName =
    type === "received"
      ? request.requester?.full_name || ""
      : request.target_contact?.full_name || "";

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              sx={{
                bgcolor: stringToColor(avatarName),
                mr: 2,
              }}
            >
              {avatarName.charAt(0) || "S"}
            </Avatar>
            <Box>
              <Typography variant="h6" component="div">
                {avatarName}
              </Typography>
              {request.contact_company && (
                <Typography variant="body2" color="text.secondary">
                  {request.contact_company}
                </Typography>
              )}
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "flex-start" }}>
            {getStatusChip()}
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {type === "received"
            ? `${request.requester?.full_name} requested an introduction to ${request.target_contact?.full_name}`
            : `You requested an introduction to ${request.target_contact?.full_name}`}
        </Typography>

        <IconButton
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
          size="small"
          sx={{
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
            ml: -1,
          }}
        >
          <ExpandMoreIcon />
        </IconButton>
        <Typography variant="body2" component="span">
          {expanded ? "Hide details" : "View details"}
        </Typography>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Purpose:
            </Typography>
            <Typography variant="body2" paragraph>
              {request.purpose}
            </Typography>

            {request.message && (
              <>
                <Typography variant="subtitle2" gutterBottom>
                  Message:
                </Typography>
                <Typography variant="body2" paragraph>
                  {request.message}
                </Typography>
              </>
            )}
          </Box>
        </Collapse>
      </CardContent>

      <Divider />

      <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
        <Typography variant="caption" color="text.secondary">
          {request.created_at
            ? formatDistanceToNow(new Date(request.created_at), {
                addSuffix: true,
              })
            : ""}
        </Typography>

        {type === "received" && request.status === "pending" && (
          <Box>
            <Tooltip title="Deny introduction request">
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<CloseIcon />}
                onClick={handleDenyClick}
                disabled={isProcessing}
                sx={{ mr: 1 }}
              >
                Deny
              </Button>
            </Tooltip>
            <Tooltip title="Approve and send introduction email">
              <Button
                variant="contained"
                color="primary"
                size="small"
                startIcon={<DoneIcon />}
                onClick={handleApproveClick}
                disabled={isProcessing}
              >
                Approve
              </Button>
            </Tooltip>
          </Box>
        )}
      </CardActions>

      {/* Approval Dialog */}
      <Dialog
        open={approveDialogOpen}
        onClose={() => setApproveDialogOpen(false)}
      >
        <DialogTitle>Approve Introduction Request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to approve this introduction request? An email
            will be sent to introduce {request.requester?.full_name} to{" "}
            {request.contact_name}.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleApproveConfirm} color="primary" autoFocus>
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      {/* Deny Dialog */}
      <Dialog open={denyDialogOpen} onClose={() => setDenyDialogOpen(false)}>
        <DialogTitle>Deny Introduction Request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to deny this introduction request? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDenyDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDenyConfirm} color="error" autoFocus>
            Deny
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default RequestCard;
