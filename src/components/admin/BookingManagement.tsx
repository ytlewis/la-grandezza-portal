import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CheckCircle, XCircle, Eye, Mail, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useData } from "@/contexts/DataContext";
import { Booking } from "@/types/admin";

const BookingManagement = () => {
  const { bookings, updateBookings, deleteBooking } = useData();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "pending": return "bg-yellow-500";
      case "approved": return "bg-blue-500";
      case "completed": return "bg-green-500";
      case "rejected": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const handleApprove = (id: string) => {
    updateBookings(bookings.map(b => 
      b.id === id ? { ...b, status: "approved" as const } : b
    ));
    toast.success("Booking approved! Confirmation email sent to client.");
  };

  const handleReject = (id: string) => {
    updateBookings(bookings.map(b => 
      b.id === id ? { ...b, status: "rejected" as const } : b
    ));
    toast.success("Booking rejected. Notification email sent to client.");
  };

  const handleDelete = (id: string) => {
    deleteBooking(id);
    setBookingToDelete(null);
    toast.success("Booking deleted successfully.");
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filterStatus === "all" || booking.status === filterStatus;
    const matchesSearch = booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white shadow-lg">
        <h2 className="text-3xl font-bold tracking-tight">Booking Management</h2>
        <p className="text-blue-100 mt-1">Manage and track all event bookings</p>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800">
                  <TableHead className="font-semibold">Client</TableHead>
                  <TableHead className="font-semibold">Event Date</TableHead>
                  <TableHead className="font-semibold">Package</TableHead>
                  <TableHead className="font-semibold">Amount</TableHead>
                  <TableHead className="font-semibold">Payment</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <TableCell>
                      <div>
                        <div className="font-medium">{booking.clientName}</div>
                        <div className="text-sm text-muted-foreground">{booking.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(booking.eventDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className="font-medium">{booking.package}</span>
                    </TableCell>
                    <TableCell className="font-semibold">KSh {booking.totalAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge className={
                          booking.paymentStatus === "fully_paid" ? "bg-green-500" :
                          booking.paymentStatus === "deposit_paid" ? "bg-blue-500" :
                          "bg-gray-500"
                        }>
                          {booking.paymentStatus === "fully_paid" ? "Paid" :
                           booking.paymentStatus === "deposit_paid" ? "Deposit" :
                           "Unpaid"}
                        </Badge>
                        {booking.depositPaid && (
                          <div className="text-xs text-muted-foreground">
                            {booking.paymentMethod?.toUpperCase()}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {booking.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => handleApprove(booking.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleReject(booking.id)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {(booking.status === "approved" || booking.status === "completed" || booking.status === "rejected") && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => setBookingToDelete(booking.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Booking Details Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>Complete information about this booking</DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Client Name</p>
                  <p className="text-sm text-muted-foreground">{selectedBooking.clientName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{selectedBooking.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{selectedBooking.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Event Date</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedBooking.eventDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Event Type</p>
                  <p className="text-sm text-muted-foreground">{selectedBooking.eventType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Package</p>
                  <p className="text-sm text-muted-foreground">{selectedBooking.package}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Guests</p>
                  <p className="text-sm text-muted-foreground">{selectedBooking.guests}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Total Amount</p>
                  <p className="text-sm text-muted-foreground">
                    KSh {selectedBooking.totalAmount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Deposit Amount</p>
                  <p className="text-sm text-muted-foreground">
                    KSh {selectedBooking.depositAmount?.toLocaleString() || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Payment Status</p>
                  <p className="text-sm">
                    <Badge className={
                      selectedBooking.paymentStatus === "fully_paid" ? "bg-green-500" :
                      selectedBooking.paymentStatus === "deposit_paid" ? "bg-blue-500" :
                      "bg-gray-500"
                    }>
                      {selectedBooking.paymentStatus === "fully_paid" ? "Fully Paid" :
                       selectedBooking.paymentStatus === "deposit_paid" ? "Deposit Paid" :
                       "Unpaid"}
                    </Badge>
                  </p>
                </div>
                {selectedBooking.transactionId && (
                  <div>
                    <p className="text-sm font-medium">Transaction ID</p>
                    <p className="text-sm text-muted-foreground font-mono">
                      {selectedBooking.transactionId}
                    </p>
                  </div>
                )}
                {selectedBooking.paymentMethod && (
                  <div>
                    <p className="text-sm font-medium">Payment Method</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedBooking.paymentMethod === "mpesa" ? "M-Pesa" : "Card"}
                    </p>
                  </div>
                )}
              </div>
              <Button className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                Send Email to Client
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!bookingToDelete} onOpenChange={() => setBookingToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this booking? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => bookingToDelete && handleDelete(bookingToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BookingManagement;
