import { Component, type OnInit } from "@angular/core"

@Component({
  selector: "app-dashboard-cards",
  templateUrl: "./dashboard-cards.component.html",
  styleUrls: ["./dashboard-cards.component.scss"],
})
export class DashboardCardsComponent implements OnInit {
  cards = [
    {
      title: "Produits en stock",
      value: "1,248",
      change: "+12 depuis hier",
      icon: "inventory_2",
      color: "primary",
    },
    {
      title: "Alertes actives",
      value: "8",
      change: "+3 depuis hier",
      icon: "warning",
      color: "warn",
    },
    {
      title: "Commandes en attente",
      value: "5",
      change: "2 urgentes",
      icon: "shopping_cart",
      color: "accent",
    },
    {
      title: "Ventes du jour",
      value: "34,500 MAD",
      change: "+15% vs. hier",
      icon: "trending_up",
      color: "info",
    },
  ]

  constructor() {}

  ngOnInit(): void {}
}
