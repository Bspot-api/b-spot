-- Script d'initialisation de la base de données Boycotteur
-- Ce fichier sera exécuté automatiquement lors du premier démarrage du conteneur PostgreSQL

-- Création d'extensions utiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Vous pouvez ajouter ici des données de test ou des configurations spécifiques
-- Exemple :
-- INSERT INTO companies (id, name, description, type) VALUES 
--   (uuid_generate_v4(), 'Entreprise Test', 'Description test', 'corporation');

-- Note: Les tables seront créées automatiquement par TypeORM avec synchronize: true 