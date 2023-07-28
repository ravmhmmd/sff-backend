--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3
-- Dumped by pg_dump version 15.3

-- Started on 2023-07-28 18:43:46

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 24644)
-- Name: fish_feedings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fish_feedings (
    id integer NOT NULL,
    pond_id integer NOT NULL,
    user_id integer NOT NULL,
    feeding_type character varying NOT NULL,
    n_fish_feed_use integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 221 (class 1259 OID 24643)
-- Name: fish_feedings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.fish_feedings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3375 (class 0 OID 0)
-- Dependencies: 221
-- Name: fish_feedings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.fish_feedings_id_seq OWNED BY public.fish_feedings.id;


--
-- TOC entry 220 (class 1259 OID 24623)
-- Name: fish_hungers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.fish_hungers (
    id integer NOT NULL,
    pond_id integer NOT NULL,
    user_id integer NOT NULL,
    video_path character varying,
    is_predicted boolean DEFAULT false NOT NULL,
    is_hungry boolean,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 219 (class 1259 OID 24622)
-- Name: fish_hungers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.fish_hungers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3376 (class 0 OID 0)
-- Dependencies: 219
-- Name: fish_hungers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.fish_hungers_id_seq OWNED BY public.fish_hungers.id;


--
-- TOC entry 218 (class 1259 OID 16437)
-- Name: ponds; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ponds (
    id integer NOT NULL,
    user_id integer NOT NULL,
    name character varying(255) NOT NULL,
    n_fish integer DEFAULT 0 NOT NULL,
    n_fish_feed_stock integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 216 (class 1259 OID 16435)
-- Name: ponds_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ponds_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3377 (class 0 OID 0)
-- Dependencies: 216
-- Name: ponds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ponds_id_seq OWNED BY public.ponds.id;


--
-- TOC entry 217 (class 1259 OID 16436)
-- Name: ponds_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ponds_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3378 (class 0 OID 0)
-- Dependencies: 217
-- Name: ponds_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ponds_user_id_seq OWNED BY public.ponds.user_id;


--
-- TOC entry 215 (class 1259 OID 16422)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(60) NOT NULL,
    n_pond integer DEFAULT 0 NOT NULL,
    n_fish_total integer DEFAULT 0 NOT NULL,
    n_fish_feed_stock_total integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- TOC entry 214 (class 1259 OID 16421)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3379 (class 0 OID 0)
-- Dependencies: 214
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 3204 (class 2604 OID 24647)
-- Name: fish_feedings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fish_feedings ALTER COLUMN id SET DEFAULT nextval('public.fish_feedings_id_seq'::regclass);


--
-- TOC entry 3201 (class 2604 OID 24626)
-- Name: fish_hungers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fish_hungers ALTER COLUMN id SET DEFAULT nextval('public.fish_hungers_id_seq'::regclass);


--
-- TOC entry 3195 (class 2604 OID 16440)
-- Name: ponds id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ponds ALTER COLUMN id SET DEFAULT nextval('public.ponds_id_seq'::regclass);


--
-- TOC entry 3196 (class 2604 OID 16441)
-- Name: ponds user_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ponds ALTER COLUMN user_id SET DEFAULT nextval('public.ponds_user_id_seq'::regclass);


--
-- TOC entry 3189 (class 2604 OID 16425)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3369 (class 0 OID 24644)
-- Dependencies: 222
-- Data for Name: fish_feedings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.fish_feedings (id, pond_id, user_id, feeding_type, n_fish_feed_use, created_at) FROM stdin;
2	5	7	examination	5	2023-07-24 17:02:00.916099
3	5	7	feeding	20	2023-07-24 17:02:44.545852
\.


--
-- TOC entry 3367 (class 0 OID 24623)
-- Dependencies: 220
-- Data for Name: fish_hungers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.fish_hungers (id, pond_id, user_id, video_path, is_predicted, is_hungry, created_at) FROM stdin;
2	5	7	https://youtube.com	t	t	2023-07-24 15:46:27.087334
3	5	7	https://vidio.com	t	f	2023-07-24 15:47:00.884867
\.


--
-- TOC entry 3365 (class 0 OID 16437)
-- Dependencies: 218
-- Data for Name: ponds; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.ponds (id, user_id, name, n_fish, n_fish_feed_stock, created_at, updated_at) FROM stdin;
6	7	pond test 6	2	200	2023-07-22 13:00:43.550908	2023-07-22 13:00:43.550908
7	7	pond test 7	2	200	2023-07-22 22:33:29.792383	2023-07-22 22:33:29.792383
5	7	pond test 5	2	75	2023-07-22 12:36:22.184267	2023-07-24 17:02:44.550557
\.


--
-- TOC entry 3362 (class 0 OID 16422)
-- Dependencies: 215
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, email, password, n_pond, n_fish_total, n_fish_feed_stock_total, created_at, updated_at) FROM stdin;
8	Adit Nugraha	adit.test@mailinator.com	$2b$10$sdmZRY/s99j9Wb5N47lVp.u73GSULVH9gDzocQJETB1oMpcasoz/a	0	0	0	2023-07-04 22:09:37.574591	2023-07-04 22:09:37.574591
7	Ini Wahyu	wahyu.test07@mailinator.com	$2b$10$.c0jD5TZGQP4ve95rkuYXuLpIea4NLiFvU7NqqM/1ZCpSTOffPWp6	3	6	475	2023-07-04 21:28:49.158741	2023-07-24 17:02:44.552213
\.


--
-- TOC entry 3380 (class 0 OID 0)
-- Dependencies: 221
-- Name: fish_feedings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.fish_feedings_id_seq', 3, true);


--
-- TOC entry 3381 (class 0 OID 0)
-- Dependencies: 219
-- Name: fish_hungers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.fish_hungers_id_seq', 3, true);


--
-- TOC entry 3382 (class 0 OID 0)
-- Dependencies: 216
-- Name: ponds_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.ponds_id_seq', 8, true);


--
-- TOC entry 3383 (class 0 OID 0)
-- Dependencies: 217
-- Name: ponds_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.ponds_user_id_seq', 1, false);


--
-- TOC entry 3384 (class 0 OID 0)
-- Dependencies: 214
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 8, true);


--
-- TOC entry 3213 (class 2606 OID 24652)
-- Name: fish_feedings fish_feedings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fish_feedings
    ADD CONSTRAINT fish_feedings_pkey PRIMARY KEY (id);


--
-- TOC entry 3211 (class 2606 OID 24632)
-- Name: fish_hungers fish_hungers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fish_hungers
    ADD CONSTRAINT fish_hungers_pkey PRIMARY KEY (id);


--
-- TOC entry 3209 (class 2606 OID 16447)
-- Name: ponds ponds_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ponds
    ADD CONSTRAINT ponds_pkey PRIMARY KEY (id);


--
-- TOC entry 3207 (class 2606 OID 16434)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3217 (class 2606 OID 24653)
-- Name: fish_feedings fish_feedings_pond_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fish_feedings
    ADD CONSTRAINT fish_feedings_pond_id_fkey FOREIGN KEY (pond_id) REFERENCES public.ponds(id);


--
-- TOC entry 3218 (class 2606 OID 24658)
-- Name: fish_feedings fish_feedings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fish_feedings
    ADD CONSTRAINT fish_feedings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3215 (class 2606 OID 24633)
-- Name: fish_hungers fish_hungers_pond_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fish_hungers
    ADD CONSTRAINT fish_hungers_pond_id_fkey FOREIGN KEY (pond_id) REFERENCES public.ponds(id);


--
-- TOC entry 3216 (class 2606 OID 24638)
-- Name: fish_hungers fish_hungers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.fish_hungers
    ADD CONSTRAINT fish_hungers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3214 (class 2606 OID 16448)
-- Name: ponds ponds_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ponds
    ADD CONSTRAINT ponds_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


-- Completed on 2023-07-28 18:43:47

--
-- PostgreSQL database dump complete
--

