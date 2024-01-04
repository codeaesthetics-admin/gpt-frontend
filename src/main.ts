// Import the necessary modules
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
// Load the environment variables from .env file
dotenv.config();

// Create the NestJS application and listen on the specified port
async function bootstrap() {
  // Create an instance of the AppModule using NestFactory
  const app = await NestFactory.create(AppModule);
  // Set the port number from the environment variable or use a default value
  const PORT = process.env.PORT || 3010;
  // Enable Cross-Origin Resource Sharing (CORS) for the application
  app.enableCors();
  // Start the application and listen on the specified port
  await app.listen(PORT);
}

// Call the bootstrap function to start the application
bootstrap();
