import django_rq
import logging

queue_name = 'default'
logger = logging.getLogger(__name__)


def hello_func():
    logger.error('Hello world')
    return


def start_job(job, *args, **kwargs):
    queue = django_rq.get_queue(queue_name)
    enqueue_method = queue.enqueue

    job = enqueue_method(
        job,
        *args,
        **kwargs,
        # job_timeout=job_timeout
    )
    return job