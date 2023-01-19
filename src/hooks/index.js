import { useIntersectionObserver, useIntervalFn } from "@vueuse/core"
import { onUnmounted, ref } from "vue"
import dayjs from "dayjs"

// 组件懒加载
export const useLazy = (apiFn) => {
    const target = ref(null)
    const result = ref(null)
    const { stop } = useIntersectionObserver(target, ([{ isIntersecting }]) => {
        if (isIntersecting) {
            stop()
            apiFn().then(data => {
                result.value = data.result
            })
        }
    }, {
        threshold: 0
    })
    return { target, result }
}

// 支付倒计时
export const usePayTime = () => {
    // 倒计时逻辑
    const time = ref(0)
    const timeText = ref('')
    const {pause, resume} = useIntervalFn(() => {
        if(time.value<=0) {
            pause()
        } else {
            time.value--
            timeText.value = dayjs.unix(time.value).format('mm分ss秒')
        }
    }, 1000, false)
    onUnmounted(() => {
        pause()
    })

    // 开启定时器countdown倒计时
    const start = (countdown) => {
        time.value = countdown
        timeText.value = dayjs.unix(time.value).format('mm分ss秒')
        resume()
    }

    return {timeText,start }
}