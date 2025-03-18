import { join } from 'path';
import pino from 'pino';

const transport = pino.transport({
  target: 'pino-roll',
  options: {
    file: join('logs', 'app.log'), 
    frequency: 'daily',            
    size: '10M',                   
    mkdir: true                    
  }
});

const logger = pino(transport);

export default logger;
