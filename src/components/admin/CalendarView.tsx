import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Booking } from "@/types/admin";
import { useData } from "@/contexts/DataContext";

const CalendarView = () => {
  const { bookings } = useData();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const getBookingsForDate = (date: Date) => {
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.eventDate);
      return bookingDate.toDateString() === date.toDateString();
    });
  };

  const getStatusColor = (status: Booking["status"]) => {
    switch (status) {
      case "pending": return "bg-yellow-500";
      case "approved": return "bg-blue-500";
      case "completed": return "bg-green-500";
      case "rejected": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  // Create modifiers for dates with bookings
  const modifiers = useMemo(() => {
    const bookedDates = bookings.map(b => {
      const date = new Date(b.eventDate);
      // Ensure the date is valid
      return isNaN(date.getTime()) ? null : date;
    }).filter(Boolean) as Date[];

    return {
      booked: bookedDates,
    };
  }, [bookings]);

  const modifiersStyles = {
    booked: {
      fontWeight: "bold" as const,
      backgroundColor: "#8b5cf6",
      color: "white",
      borderRadius: "50%",
    },
  };

  const selectedDateBookings = date ? getBookingsForDate(date) : [];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white shadow-lg">
        <h2 className="text-3xl font-bold tracking-tight">Event Calendar</h2>
        <p className="text-indigo-100 mt-1">View and manage scheduled events</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Total Events</p>
              <p className="text-3xl font-bold text-purple-600">{bookings.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">
                {bookings.filter(b => b.status === "pending").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Approved</p>
              <p className="text-3xl font-bold text-blue-600">
                {bookings.filter(b => b.status === "approved").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-600">
                {bookings.filter(b => b.status === "completed").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <p className="text-sm text-muted-foreground">
              {bookings.length > 0 
                ? `${bookings.length} event${bookings.length !== 1 ? 's' : ''} scheduled`
                : "No events scheduled yet"}
            </p>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>
              Events on {date?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) || "Selected Date"}
            </CardTitle>
          </CardHeader>
          <CardContent className="min-h-[400px] flex flex-col">
            {selectedDateBookings.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-center py-12">
                <div>
                  <div className="h-12 w-12 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <span className="text-2xl">📅</span>
                  </div>
                  <p className="text-muted-foreground font-medium">
                    No events scheduled for this date
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Select a highlighted date to view events
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedDateBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-4 border rounded-lg cursor-pointer hover:bg-accent hover:shadow-md transition-all"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-lg">{booking.clientName}</h4>
                        <p className="text-sm text-muted-foreground">{booking.eventType}</p>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="text-sm space-y-1 text-muted-foreground">
                      <p>📦 Package: <span className="font-medium text-foreground">{booking.package}</span></p>
                      <p>👥 Guests: <span className="font-medium text-foreground">{booking.guests}</span></p>
                      <p>💰 Amount: <span className="font-medium text-foreground">KSh {booking.totalAmount.toLocaleString()}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Status Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500" />
              <span className="text-sm">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500" />
              <span className="text-sm">Approved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-500" />
              <span className="text-sm">Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500" />
              <span className="text-sm">Rejected</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Booking Details Dialog */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium">Client</p>
                <p className="text-sm text-muted-foreground">{selectedBooking.clientName}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Contact</p>
                <p className="text-sm text-muted-foreground">{selectedBooking.email}</p>
                <p className="text-sm text-muted-foreground">{selectedBooking.phone}</p>
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
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarView;
