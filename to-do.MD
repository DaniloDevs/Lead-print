
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

* [x] `GET /metrics/overview` (visão geral)
* [x] `GET /metrics/events/:id` (métricas por evento)
* [x] `GET /metrics/events/:id/funnel` (funil do evento)
* [x] `GET /metrics/daily` (crescimento diário)
* [x] `GET /metrics/events-ranking` (ranking de eventos por leads)


# **Jobs**

* [ ] Criar rota admin: `GET /jobs/queues` (listar filas e status)
* [ ] Criar rota admin: `GET /jobs/queues/:name` (detalhes de uma fila)
* [ ] Criar rota admin: `POST /jobs/queues/:name/retry` (reprocessar jobs falhos)
* [ ] Criar rota admin: `DELETE /jobs/queues/:name/clean` (limpar jobs concluídos/falhos)

