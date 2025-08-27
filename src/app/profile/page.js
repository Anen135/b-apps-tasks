"use client"

import React, { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import * as Dialog from "@radix-ui/react-dialog"
import * as Tooltip from "@radix-ui/react-tooltip"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, Save, X, Check, UploadCloud, Copy } from "lucide-react"
import { Spinner } from "@/components/Loading"
import Image from "next/image"
import ColorPicker from "@/components/ColorPicker"
import ImageDropzone from "@/components/ImageDropzone"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [initial, setInitial] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ nickname: "", email: "", color: "#22c55e", tags: "", password: "", avatarUrl: "", metadata: "{}" })
  const [tagInput, setTagInput] = useState("")
  const fileRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)
  const metadataRef = useRef(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/users/me", { credentials: "include" })
        if (!res.ok) throw new Error((await res.json()).error || res.statusText)
        const data = await res.json()
        if (!mounted) return
        setUser(data)

        const tagsString = (data.tags || []).join(", ")
        const metadataString = JSON.stringify(data.metadata || {}, null, 2)

        const initialSnapshot = {
          nickname: data.nickname || "",
          email: data.email || "",
          color: data.color || "#22c55e",
          tags: tagsString,
          avatarUrl: data.avatarUrl || "",
          metadata: metadataString,
        }

        setInitial(initialSnapshot)
        setForm({ ...initialSnapshot, password: "" })
      } catch (err) {
        console.error(err)
        setError(err.message || "Failed to load user")
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const onChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const addTagFromInput = () => {
    const t = tagInput.trim()
    if (!t) return
    const tags = form.tags.split(",").map(x => x.trim()).filter(Boolean)
    if (!tags.includes(t)) tags.push(t)
    setForm(prev => ({ ...prev, tags: tags.join(", ") }))
    setTagInput("")
  }

  const removeTag = (tag) => {
    const tags = form.tags.split(",").map(x => x.trim()).filter(Boolean).filter(t => t !== tag)
    setForm(prev => ({ ...prev, tags: tags.join(", ") }))
  }

  const uploadAvatarFile = async (file) => {
    if (!file) return
    setMessage(null)
    setError(null)

    try {
      const fd = new FormData()
      fd.append("avatar", file)
      const res = await fetch("/api/uploads/avatar", { method: "POST", body: fd, credentials: "include" })
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || res.statusText)
      }
      const data = await res.json()
      if (data?.url) {
        setForm(prev => ({ ...prev, avatarUrl: data.url }))
        setMessage("Аватар обновлён")
      } else {
        throw new Error("Upload succeeded but server didn't return url")
      }
    } catch (err) {
      console.warn(err)
      setError("Загрузка не удалась — вставьте публичный URL в поле Avatar URL вместо этого. (Эндпоинт /api/uploads/avatar может отсутствовать)")
    } finally {
      if (fileRef.current) fileRef.current.value = ""
      setTimeout(() => { setMessage(null); setError(null) }, 4000)
    }
  }

  const copyAvatarUrl = async () => {
    try {
      await navigator.clipboard.writeText(form.avatarUrl || "")
      setMessage("URL аватара скопирован")
    } catch (err) {
      setError("Не удалось скопировать")
    } finally {
      setTimeout(() => { setMessage(null); setError(null) }, 2000)
    }
  }

  const isDirty = () => {
    if (!initial) return false
    return (
      form.nickname !== initial.nickname ||
      (form.email || null) !== (initial.email || null) ||
      form.color !== initial.color ||
      form.tags !== initial.tags ||
      (form.password || "") !== (initial.password || "") ||
      (form.avatarUrl || "") !== (initial.avatarUrl || "") ||
      form.metadata !== initial.metadata
    )
  }

  const onSave = async (e) => {
    e?.preventDefault()
    setSaving(true)
    setMessage(null)
    setError(null)

    if (!isDirty()) {
      setMessage("Нет изменений для сохранения")
      setSaving(false)
      setTimeout(() => setMessage(null), 2000)
      return
    }

    if (form.password && form.password.length < 6) {
      setError("Пароль должен быть не менее 6 символов")
      setSaving(false)
      setTimeout(() => setError(null), 3000)
      return
    }

    let metadataJson = {}
    try {
      metadataJson = form.metadata ? JSON.parse(form.metadata) : {}
    } catch (err) {
      setError("Metadata должен быть валидным JSON")
      setSaving(false)
      return
    }

    try {
      const payload = {
        nickname: form.nickname,
        email: form.email || null,
        color: form.color,
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
        avatarUrl: form.avatarUrl || undefined,
        metadata: metadataJson,
      }
      if (form.password) payload.password = form.password

      const res = await fetch("/api/users/me", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || res.statusText)
      setUser(data)

      const tagsString = (data.tags || []).join(", ")
      const metadataString = JSON.stringify(data.metadata || {}, null, 2)
      const newSnapshot = {
        nickname: data.nickname || "",
        email: data.email || "",
        color: data.color || "#22c55e",
        tags: tagsString,
        avatarUrl: data.avatarUrl || "",
        metadata: metadataString,
      }
      setInitial(newSnapshot)
      setForm(prev => ({ ...prev, password: "", ...newSnapshot }))

      setMessage("Профиль сохранён")
    } catch (err) {
      console.error(err)
      setError(err.message || "Save failed")
    } finally {
      setSaving(false)
      setTimeout(() => { setMessage(null); setError(null) }, 3500)
    }
  }

  const onDeleteAccount = async () => {
    setError(null)
    setMessage(null)
    try {
      const res = await fetch("/api/users/me", { method: "DELETE", credentials: "include" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || res.statusText)
      router.push("/")
    } catch (err) {
      console.error(err)
      setError(err.message || "Delete failed")
      setTimeout(() => setError(null), 4000)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer?.files?.[0]
    if (file) uploadAvatarFile(file)
  }

  return (
    <>
      {loading ?
        (<div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center text-slate-500"> <Spinner /> Загрузка профиля…</div>
        </div>)
        : user ?
          <Tooltip.Provider>
            <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-6 py-15">
              <div className="max-w-5xl mx-auto">

                {/* header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Профиль</h1>
                    <p className="text-sm text-slate-500">Настройте публичную информацию, аватар и метаданные</p>
                  </div>
                  <div className="hidden sm:flex items-center gap-3">
                    <button
                      onClick={() => { setForm({ ...initial, password: "" }); setMessage("Изменения отменены"); }}
                      className="px-3 py-2 rounded-md border"
                    >
                      Отменить
                    </button>

                    <Tooltip.Root delayDuration={250}>
                      <Tooltip.Trigger asChild>
                        <button
                          onClick={onSave}
                          disabled={!isDirty() || saving}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-sky-600 text-white disabled:opacity-60"
                        >
                          {saving ? <Spinner size={16} /> : <Save size={16} />} Сохранить
                        </button>
                      </Tooltip.Trigger>
                      <Tooltip.Content sideOffset={6} className="rounded p-2 text-sm shadow bg-gray-900 text-white">
                        Сохраняет nickname, email, color, tags, avatarUrl, metadata и пароль
                      </Tooltip.Content>
                    </Tooltip.Root>

                    <Dialog.Root>
                      <Dialog.Trigger asChild>
                        <button className="px-3 py-2 rounded-md border text-rose-600 inline-flex items-center gap-2">
                          <Trash2 size={16} /> Удалить
                        </button>
                      </Dialog.Trigger>
                      <Dialog.Portal>
                        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
                        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded p-6 shadow-lg w-[90%] max-w-md">
                          <Dialog.Title className="text-lg font-bold mb-2">Подтвердите удаление аккаунта</Dialog.Title>
                          <p className="text-sm text-slate-600 mb-4">Это действие удалит аккаунт. Действие необратимо.</p>
                          <div className="flex justify-end gap-2">
                            <Dialog.Close asChild>
                              <button className="px-3 py-2 rounded-md border">Отмена</button>
                            </Dialog.Close>
                            <Dialog.Close asChild>
                              <button onClick={onDeleteAccount} className="px-3 py-2 rounded-md bg-rose-600 text-white">
                                Удалить
                              </button>
                            </Dialog.Close>
                          </div>
                        </Dialog.Content>
                      </Dialog.Portal>
                    </Dialog.Root>
                  </div>
                </div>


                {/* messages */}
                <div className="mb-5">
                  <AnimatePresence>
                    {message && (
                      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="inline-flex items-center gap-2 px-4 py-2 rounded bg-emerald-50 text-emerald-700">
                        <Check size={16} /> {message}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {error && (
                      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="inline-flex items-center gap-2 px-4 py-2 rounded bg-rose-50 text-rose-700">
                        <X size={16} /> {error}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="bg-white rounded-2xl shadow p-6 grid grid-cols-1 md:grid-cols-3 gap-6">

                  {/* LEFT: preview card */}
                  <div className="md:col-span-1 flex flex-col items-center gap-4">
                    <div className="w-full bg-gradient-to-br from-white to-slate-50 rounded-xl p-4 shadow-sm">
                      <div className="flex flex-col items-center gap-3">
                        <div style={{ borderColor: form.color, boxShadow: `0 0 0 4px ${form.color}` }} className="rounded-full p-1">
                          <Image src={form.avatarUrl || user.avatarUrl || '/unset_avatar.png'} width={128} height={128} alt="avatar" className="w-32 h-32 rounded-full object-cover shadow" />
                        </div>

                        <div className="text-center">
                          <h2 className="text-lg font-semibold">{form.nickname || user.nickname || user.login}</h2>
                          <div className="text-xs text-slate-500">@{user.login}</div>
                        </div>

                        <div className="flex flex-wrap gap-2 items-center mt-2">
                          <div className="min-w-[150px] inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-sm">
                            ID: <span className="font-mono ml-1">{user.id}</span>
                          </div>
                          <div className="min-w-[150px] inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-sm">
                            Создан: <span className="ml-1">{new Date(user.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>


                        <div className="w-full mt-4">
                          <div className="text-sm text-slate-600 mb-1">Live preview</div>
                          <div className="w-full h-[56px] rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(180deg, rgba(255,255,255,0.6), ${form.color})` }}>
                            <div className="text-sm font-medium text-slate-800">Привет, {form.nickname || 'пользователь'}!</div>
                          </div>
                        </div>

                      </div>
                    </div>

                    <div className="w-full text-sm text-slate-500">Совет: выберите заметный цвет — он используется как акцент вокруг аватара.</div>
                  </div>

                  {/* RIGHT: form */}
                  <div className="md:col-span-2">
                    <form onSubmit={onSave} className="space-y-4">

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Nickname</label>
                          <input name="nickname" value={form.nickname} onChange={onChange} className="w-full rounded-lg px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-sky-200" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Email</label>
                          <input name="email" value={form.email || ""} onChange={onChange} className="w-full rounded-lg px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-sky-200" />
                          <p className="text-xs text-slate-400 mt-1">Меняйте с осторожностью — email может быть связан с внешними сервисами.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                        <div>
                          <label className="block text-sm font-medium mb-2">Color</label>
                          <ColorPicker value={form.color} onChange={color => setForm(prev => ({ ...prev, color }))} className=" h-10 p-2 border rounded-md" showLabel={false} showIcon={false} />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium mb-2">Avatar URL</label>
                          <div className="flex gap-2 flex-wrap">
                            <input placeholder="Paste public avatar URL" name="avatarUrl" value={form.avatarUrl} onChange={onChange} className="flex-1 rounded-lg px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-sky-200" />
                            <button type="button" onClick={() => setForm(prev => ({ ...prev, avatarUrl: prev.avatarUrl.trim() }))} className="px-3 py-2 rounded-md border inline-flex items-center gap-2"><UploadCloud size={14} />Apply</button>
                            <button type="button" onClick={copyAvatarUrl} className="px-3 py-2 rounded-md border inline-flex items-center gap-2"><Copy size={14} />Copy</button>
                          </div>
                          <div className="text-xs text-slate-400 mt-2">Текущий URL: <span className="font-mono break-all">{form.avatarUrl || user.avatarUrl}</span></div>

                          <div onDrop={handleDrop} onDragOver={e => { e.preventDefault(); setDragActive(true) }} onDragLeave={() => setDragActive(false)} className={`mt-3 border-dashed rounded-lg p-3 ${dragActive ? 'border-sky-300 bg-sky-50' : 'border-transparent'}`}>
                            <div className="flex items-center gap-3 pointer-none">
                              <ImageDropzone accept="image/*" maxSizeMB={5} onChange={uploadAvatarFile} disabled={true} />
                            </div>
                          </div>

                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Tags</label>
                        <div className="flex gap-2 items-center flex-wrap">
                          <input placeholder="Add tag" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTagFromInput() } }} className="flex-1 rounded-lg px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-sky-200" />
                          <button type="button" onClick={addTagFromInput} className="px-3 py-2 rounded-md border">Add</button>
                        </div>
                        <div className="flex gap-2 flex-wrap mt-3">
                          {form.tags.split(",").map(t => t.trim()).filter(Boolean).map(t => (
                            <motion.span key={t} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="px-3 py-1 bg-slate-100 rounded-full text-sm flex items-center gap-2">
                              {t}
                              <button onClick={() => removeTag(t)} type="button" className="text-xs px-1">×</button>
                            </motion.span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Password</label>
                          <input name="password" value={form.password} onChange={onChange} type="password" className="w-full rounded-lg px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-sky-200" />
                          <p className="text-xs text-slate-400 mt-1">Минимум 6 символов — только если хотите поменять.</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Metadata (JSON)</label>
                          <textarea ref={metadataRef} name="metadata" value={form.metadata} onChange={onChange} rows={4} className="w-full rounded-lg px-3 py-2 border font-mono text-sm focus:outline-none focus:ring-2 focus:ring-sky-200" />
                          <div className="flex items-center gap-3 mt-2">
                            <div className="text-xs text-slate-400">JSON валиден: <span className={`font-mono ml-2 ${isJsonValid(form.metadata) ? 'text-emerald-600' : 'text-rose-600'}`}>{isJsonValid(form.metadata) ? 'Yes' : 'No'}</span></div>
                            <button type="button" onClick={() => { setForm(prev => ({ ...prev, metadata: JSON.stringify({}, null, 2) })) }} className="px-2 py-1 rounded border text-xs">Reset</button>
                          </div>
                        </div>
                      </div>
                    </form>

                    {/* notes */}
                    <div className="mt-6 text-xs text-slate-500">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Аватарки: иногда лучше вставить публичный URL.</li>
                        <li>Теги могут использоваться в других местах — меняйте с вниманием.</li>
                        <li>Metadata хранится как JSON — убедитесь в корректности.</li>
                      </ul>
                    </div>

                  </div>

                </div>

                {/* sticky mobile save bar */}
                <AnimatePresence>
                  <motion.div
                    initial={{ y: 80 }}
                    animate={{ y: 0 }}
                    exit={{ y: 80 }}
                    className="fixed left-0 right-0 bottom-4 px-6 sm:hidden"
                  >
                    <div className="max-w-xl mx-auto flex gap-3">
                      <button
                        onClick={() => { setForm({ ...initial, password: "" }); setMessage("Изменения отменены"); }}
                        className="flex-1 px-4 py-3 rounded-2xl border"
                      >
                        Отменить
                      </button>

                      <Tooltip.Root delayDuration={250}>
                        <Tooltip.Trigger asChild>
                          <button
                            onClick={onSave}
                            disabled={!isDirty() || saving}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-sky-600 text-white shadow-lg disabled:opacity-60"
                          >
                            {saving ? <Spinner size={16} /> : <Save size={16} />} Сохранить
                          </button>
                        </Tooltip.Trigger>
                        <Tooltip.Content sideOffset={6} className="rounded p-2 text-sm shadow bg-gray-900 text-white">
                          Сохраняет nickname, email, color, tags, avatarUrl, metadata и пароль
                        </Tooltip.Content>
                      </Tooltip.Root>

                      <Dialog.Root>
                        <Dialog.Trigger asChild>
                          <button className="flex-1 px-4 py-3 rounded-2xl border text-rose-600 inline-flex items-center justify-center gap-2">
                            <Trash2 size={16} />
                          </button>
                        </Dialog.Trigger>
                        <Dialog.Portal>
                          <Dialog.Overlay className="fixed inset-0 bg-black/40" />
                          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded p-6 shadow-lg w-[90%] max-w-md">
                            <Dialog.Title className="text-lg font-bold mb-2">Подтвердите удаление аккаунта</Dialog.Title>
                            <p className="text-sm text-slate-600 mb-4">Это действие удалит аккаунт. Действие необратимо.</p>
                            <div className="flex justify-end gap-2">
                              <Dialog.Close asChild>
                                <button className="px-3 py-2 rounded-md border">Отмена</button>
                              </Dialog.Close>
                              <Dialog.Close asChild>
                                <button onClick={onDeleteAccount} className="px-3 py-2 rounded-md bg-rose-600 text-white">
                                  Удалить
                                </button>
                              </Dialog.Close>
                            </div>
                          </Dialog.Content>
                        </Dialog.Portal>
                      </Dialog.Root>
                    </div>
                  </motion.div>
                </AnimatePresence>


              </div>
            </main>
          </Tooltip.Provider> :
          <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center text-red-600">{error || "User not found"}</div>
          </div>}
    </>
  )
}


// small helper: lightweight JSON validation shown in UI
function isJsonValid(str) {
  try {
    if (!str) return true
    JSON.parse(str)
    return true
  } catch (e) {
    return false
  }
}
