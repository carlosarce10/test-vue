import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

export const useSwal = () => Swal

export const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
})

export default Swal
