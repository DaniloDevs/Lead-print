
# **Events**

* [x] `GET /events` 
* [x] `GET /events/:slug` (buscar por slug)
* [x] `POST /events` (criar evento)
* [x] `PATCH /events/:id/status` (ativar/desativar)
* [x] `GET /events/:id/leads` (listar leads do evento)
* [x] `GET /events/:id/export/leads.csv` (exportar leads do evento)

# **Leads**

* [ ] `GET /leads` (listar com filtros)
* [x] `POST /leads` (criar lead vinculado ao evento)
* [ ] `GET /leads/export/all.csv` (exportar todos os leads)


# **Metrics**

* [ ] `GET /metrics/overview` (visão geral)
* [ ] `GET /metrics/events/:id` (métricas por evento)
* [ ] `GET /metrics/events/:id/funnel` (funil do evento)
* [ ] `GET /metrics/daily` (crescimento diário)
* [ ] `GET /metrics/events-ranking` (ranking de eventos por leads)
