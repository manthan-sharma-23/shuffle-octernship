#!/bin/sh
curl -XPOST http://localhost:5001/api/v1/workflows/1d9d8ce2-566e-4c3f-8a37-5d6c7d2000b5/execute -d '{"execution_argument":""}' -H "Authorization: Bearer 144308d0-6aab-4d4f-8bb2-75189281ee26"


curl -XPOST http://localhost:5001/api/v1/workflows/1d9d8ce2-566e-4c3f-8a37-5d6c7d2000b5/execute -d '{"execution_argument":""}' -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjYwZjQwNjBlNThkNzVmZDNmNzBiZWZmODhjNzk0YTc3NTMyN2FhMzEiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJodHRwczovL3NodWZmbGVyLmlvL2FwaS92MS93b3JrZmxvd3MvMWQ5ZDhjZTItNTY2ZS00YzNmLThhMzctNWQ2YzdkMjAwMGI1L2V4ZWN1dGUiLCJhenAiOiIxMDMwNzY3ODIwNjE0MjQ2MTg0MjIiLCJlbWFpbCI6InNjaGVkdWxlckBzaHVmZmxlLTI0MTUxNy5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJleHAiOjE1NjU1Mjc1NTEsImlhdCI6MTU2NTUyMzk1MSwiaXNzIjoiaHR0cHM6Ly9hY2NvdW50cy5nb29nbGUuY29tIiwic3ViIjoiMTAzMDc2NzgyMDYxNDI0NjE4NDIyIn0.r0EDq9fjhf_5CPTiltyfk_L3uYJp577Uy0yYPcCAl2nv50_z_oUtbWGBpQLL8gcj-NGd3g4E52Qur8k6hCMIQweLS6WAb1279vGffEoCNDfkWb3Oy-yJGP1kzwLvqFJqnHLkSWYXNWvSyWnEimW8Rryx_m1BXS5wcA8l4NIr83kS7fPZrTwjnwFSeGSThwk91DVARzapQb8r0GEgOUyHZ1aBXnV98mikzSUt-5xFKe9eMdD22YJAj0Ru-DxAxs5nOqghX4PMRysWjshjOMrlR1piPWxqAmewp8YKZDCQ5gXskpeAFBDoULT971Wsx_NCohnJsFqx1JfPS9ZYMTW2oQ"