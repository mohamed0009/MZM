"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Clock, Plus } from "lucide-react"
import { fr } from "date-fns/locale"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameDay } from "date-fns"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CalendarViewProps {
  data?: any[] 
}

export function CalendarView({ data = [] }: CalendarViewProps) {
  const [date, setDate] = useState<Date>(new Date())
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [view, setView] = useState<"month" | "week" | "day">("month")
  const [eventTitle, setEventTitle] = useState("")
  const [eventType, setEventType] = useState("appointment")
  const [eventTime, setEventTime] = useState("09:00")
  const [eventEndTime, setEventEndTime] = useState("09:30")
  const [eventDescription, setEventDescription] = useState("")
  const [events, setEvents] = useState(data)
  const [successMessage, setSuccessMessage] = useState("")

  // Fonction pour obtenir les jours du mois actuel
  const getDaysInMonth = () => {
    const start = startOfMonth(date)
    const end = endOfMonth(date)
    return eachDayOfInterval({ start, end })
  }

  // Obtenir les jours du mois
  const daysInMonth = getDaysInMonth()

  // Fonction pour obtenir les événements du jour sélectionné
  const getDayEvents = (day: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date)
      return isSameDay(eventDate, day)
    })
  }

  // Fonction pour naviguer entre les mois
  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = direction === "prev" ? subMonths(date, 1) : addMonths(date, 1)
    setDate(newDate)
  }

  // Fonction pour ajouter un nouvel événement
  const handleAddEvent = () => {
    if (!selectedDate || !eventTitle) return

    const newEvent = {
      id: events.length + 1,
      title: eventTitle,
      date: selectedDate,
      time: eventTime,
      type: eventType as "appointment" | "delivery" | "meeting" | "other",
      client: eventType === "appointment" ? "Client" : "Interne",
    }

    setEvents([...events, newEvent])
    setSuccessMessage(`Événement "${eventTitle}" ajouté avec succès pour le ${format(selectedDate, "dd/MM/yyyy")}.`)

    // Réinitialiser le formulaire
    setEventTitle("")
    setEventType("appointment")
    setEventTime("09:00")
    setEventEndTime("09:30")
    setEventDescription("")
    setOpenDialog(false)

    // Effacer le message après 3 secondes
    setTimeout(() => {
      setSuccessMessage("")
    }, 3000)
  }

  return (
    <Card className="col-span-3">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CardTitle>Calendrier</CardTitle>
            <div className="flex space-x-1">
              <Button
                variant="outline"
                size="sm"
                className={view === "day" ? "bg-pharma-primary text-white hover:bg-pharma-primary/90" : "hover:bg-pharma-primary/10"}
                onClick={() => setView("day")}
              >
                Jour
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={view === "week" ? "bg-pharma-primary text-white hover:bg-pharma-primary/90" : "hover:bg-pharma-primary/10"}
                onClick={() => setView("week")}
              >
                Semaine
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={view === "month" ? "bg-pharma-primary text-white hover:bg-pharma-primary/90" : "hover:bg-pharma-primary/10"}
                onClick={() => setView("month")}
              >
                Mois
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" className="hover:bg-pharma-primary/10" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="hover:bg-pharma-primary/10" onClick={() => setDate(new Date())}>
              Aujourd'hui
            </Button>
            <Button variant="outline" size="icon" className="hover:bg-pharma-primary/10" onClick={() => navigateMonth("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button className="bg-pharma-primary hover:bg-pharma-primary/90 text-white flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  Événement
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Ajouter un événement</DialogTitle>
                  <DialogDescription>Créez un nouvel événement dans votre calendrier</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className="text-right">
                      Titre
                    </Label>
                    <Input
                      id="title"
                      className="col-span-3"
                      placeholder="Rendez-vous client"
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="date" className="text-right">
                      Date
                    </Label>
                    <div className="col-span-3">
                      <Input
                        type="date"
                        value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}
                        onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value) : undefined)}
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="time" className="text-right">
                      Heure
                    </Label>
                    <div className="col-span-3 flex space-x-2">
                      <Select value={eventTime} onValueChange={setEventTime}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Heure de début" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => i + 8).map((hour) => (
                            <SelectItem key={hour} value={`${hour}:00`}>{`${hour}:00`}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={eventEndTime} onValueChange={setEventEndTime}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Heure de fin" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 12 }, (_, i) => i + 8).map((hour) => (
                            <SelectItem key={hour} value={`${hour}:30`}>{`${hour}:30`}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Type
                    </Label>
                    <Select value={eventType} onValueChange={setEventType}>
                      <SelectTrigger className="col-span-3 w-full">
                        <SelectValue placeholder="Type d'événement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="appointment">Rendez-vous</SelectItem>
                        <SelectItem value="delivery">Livraison</SelectItem>
                        <SelectItem value="meeting">Réunion</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="description" className="text-right pt-2">
                      Notes
                    </Label>
                    <Textarea
                      id="description"
                      className="col-span-3"
                      value={eventDescription}
                      onChange={(e) => setEventDescription(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleAddEvent}>
                    Enregistrer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <CardDescription>Gérez vos rendez-vous, livraisons et événements importants</CardDescription>

        {successMessage && (
          <Alert className="mt-2 bg-green-50 text-green-800 border-green-200">
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        )}
      </CardHeader>
      <CardContent>
        {view === "month" && (
          <div className="space-y-4">
            <div className="text-center text-xl font-semibold text-pharma-primary">{format(date, "MMMM yyyy", { locale: fr })}</div>

            <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden shadow-sm">
              {/* Jours de la semaine */}
              {["lu", "ma", "me", "je", "ve", "sa", "di"].map((day) => (
                <div key={day} className="bg-pharma-primary/5 p-2 text-center font-medium text-pharma-primary">
                  {day}
                </div>
              ))}

              {/* Jours du mois précédent */}
              {Array.from({ length: new Date(date.getFullYear(), date.getMonth(), 1).getDay() || 7 - 1 }).map(
                (_, i) => (
                  <div key={`prev-${i}`} className="bg-white p-2 text-gray-400 min-h-[100px] hover:bg-gray-50 transition-colors">
                    {new Date(date.getFullYear(), date.getMonth(), 0 - i).getDate()}
                  </div>
                ),
              )}

              {/* Jours du mois actuel */}
              {daysInMonth.map((day) => {
                const dayEvents = getDayEvents(day)
                return (
                  <div
                    key={day.toString()}
                    className={`bg-white p-2 min-h-[100px] cursor-pointer transition-colors ${
                      isToday(day) 
                        ? "bg-pharma-primary/5 font-bold ring-1 ring-pharma-primary ring-inset" 
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setSelectedDate(day)
                      setOpenDialog(true)
                    }}
                  >
                    <div className={`text-right ${isToday(day) ? "text-pharma-primary" : ""}`}>{day.getDate()}</div>
                    <div className="mt-1 space-y-1">
                      {dayEvents.slice(0, 2).map((event, i) => (
                        <div key={i} className={`text-xs p-1.5 rounded-md shadow-sm ${getEventColor(event.type)}`}>
                          {event.time} {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-pharma-primary/70 text-center font-medium">
                          +{dayEvents.length - 2} plus
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}

              {/* Jours du mois suivant */}
              {Array.from({
                length:
                  42 - (daysInMonth.length + (new Date(date.getFullYear(), date.getMonth(), 1).getDay() || 7 - 1)),
              }).map((_, i) => (
                <div key={`next-${i}`} className="bg-white p-2 text-gray-400 min-h-[100px] hover:bg-gray-50 transition-colors">
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        )}

        {view === "day" && (
          <div className="border rounded-md shadow-sm">
            <div className={`p-4 text-center ${
              isToday(date) 
                ? "bg-pharma-primary text-white" 
                : "bg-pharma-primary/5 text-pharma-primary"
            }`}>
              <div className="text-sm font-medium">{format(date, "EEEE", { locale: fr })}</div>
              <div className="text-xl">{format(date, "d MMMM yyyy", { locale: fr })}</div>
            </div>
            <div className="divide-y">
              {Array.from({ length: 12 }, (_, i) => i + 8).map((hour) => (
                <div key={hour} className="flex p-3 hover:bg-gray-50 transition-colors">
                  <div className="w-16 text-sm text-pharma-primary/70 font-medium">{`${hour}:00`}</div>
                  <div className="flex-1">
                    {getDayEvents(date)
                      .filter((event) => {
                        const eventHour = Number.parseInt(event.time.split(":")[0])
                        return eventHour === hour
                      })
                      .map((event, eventIndex) => (
                        <div key={eventIndex} className={`mb-2 p-2.5 rounded-md text-sm shadow-sm ${getEventColor(event.type)}`}>
                          <div className="font-medium">{event.title}</div>
                          <div className="text-xs mt-1">{event.client}</div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === "week" && (
          <div className="grid grid-cols-7 gap-3">
            {getWeekDays(date).map((day, index) => (
              <div key={index} className="border rounded-md overflow-hidden shadow-sm">
                <div className={`p-3 text-center ${
                  isToday(day) 
                    ? "bg-pharma-primary text-white" 
                    : "bg-pharma-primary/5 text-pharma-primary"
                }`}>
                  <div className="text-sm font-medium">{format(day, "EEE", { locale: fr })}</div>
                  <div className="text-xl">{day.getDate()}</div>
                </div>
                <div className="p-2 h-[400px] overflow-y-auto">
                  {getDayEvents(day).map((event, eventIndex) => (
                    <div key={eventIndex} className={`mb-2 p-2.5 rounded-md text-sm shadow-sm ${getEventColor(event.type)}`}>
                      <div className="font-medium">{event.title}</div>
                      <div className="flex items-center text-xs mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {event.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Fonction pour obtenir les jours de la semaine
function getWeekDays(date: Date) {
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1) // Ajuster quand le jour est dimanche
  const monday = new Date(date)
  monday.setDate(diff)

  const weekDays = []
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday)
    day.setDate(monday.getDate() + i)
    weekDays.push(day)
  }

  return weekDays
}

// Fonction pour obtenir la couleur de l'événement en fonction du type
function getEventColor(type: string): string {
  switch (type) {
    case "appointment":
      return "bg-pharma-primary/10 text-pharma-primary border-l-4 border-pharma-primary"
    case "delivery":
      return "bg-pharma-secondary/10 text-pharma-secondary border-l-4 border-pharma-secondary"
    case "meeting":
      return "bg-pharma-accent/10 text-pharma-accent border-l-4 border-pharma-accent"
    default:
      return "bg-gray-50 text-gray-700 border-l-4 border-gray-500"
  }
}

// Données fictives pour les événements avec des clients marocains
const initialEvents = [
  {
    id: 1,
    title: "Consultation M. Alami",
    date: new Date(2024, 3, 22),
    time: "09:00",
    type: "appointment" as const,
    client: "Mohammed Alami",
  },
  {
    id: 2,
    title: "Livraison fournisseur",
    date: new Date(2024, 3, 22),
    time: "14:00",
    type: "delivery" as const,
    client: "MediSupply Maroc",
  },
  {
    id: 3,
    title: "Réunion équipe",
    date: new Date(2024, 3, 23),
    time: "10:00",
    type: "meeting" as const,
    client: "Interne",
  },
  {
    id: 4,
    title: "Consultation Mme Tazi",
    date: new Date(2024, 3, 24),
    time: "11:00",
    type: "appointment" as const,
    client: "Amina Tazi",
  },
  {
    id: 5,
    title: "Inventaire mensuel",
    date: new Date(2024, 3, 25),
    time: "16:00",
    type: "other" as const,
    client: "Interne",
  },
  {
    id: 6,
    title: "Consultation M. Mansouri",
    date: new Date(2024, 3, 26),
    time: "09:30",
    type: "appointment" as const,
    client: "Youssef Mansouri",
  },
  {
    id: 7,
    title: "Formation nouveaux produits",
    date: new Date(2024, 3, 26),
    time: "14:00",
    type: "meeting" as const,
    client: "Laboratoire Pharma Maroc",
  },
]
