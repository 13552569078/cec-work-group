import { inject, onMounted, onUnmounted } from "vue";
import { Emitter, Handler } from "mitt";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useEventBus(event: string, handler: Handler<any>, mounted = false): Emitter {
  const $eventBus = inject("$mitter") as Emitter;

  if (mounted) {
    onMounted(() => {
      $eventBus.on(event, handler);
    });
  } else {
    $eventBus.on(event, handler);
  }

  onUnmounted(() => {
    $eventBus.off(event, handler);
  });
  return $eventBus;
}

export { useEventBus };
