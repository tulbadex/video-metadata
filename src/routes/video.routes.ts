import { Router } from 'express'
import { VideoController } from '../controllers/video.controller'
import { authenticate } from '../middleware/auth'
import { videoValidation } from '../middleware/validation';

const router = Router()
const videoController = new VideoController()

// router.post('/', authenticate, videoController.create)
// router.put('/:id', authenticate, videoController.update)
// router.get('/', videoController.get)
// router.delete('/:id', authenticate, videoController.delete)

// Bind class methods to maintain 'this' context
// router.post('/', [authenticate, ...videoValidation], videoController.create.bind(videoController));
// router.put('/:id', [authenticate, ...videoValidation], videoController.update.bind(videoController));
router.post('/', authenticate, videoController.create.bind(videoController));
router.put('/:id', authenticate, videoController.update.bind(videoController));
router.get('/', videoController.get.bind(videoController));
router.delete('/:id', authenticate, videoController.delete.bind(videoController));

export default router