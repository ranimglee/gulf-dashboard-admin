import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Calendar,
  FileText,
  Image,
  Upload,
  Trash2,
  Edit,
} from 'lucide-react';

import { ContentItem } from '../../../types/types';

interface ItemCardProps {
  item: ContentItem;
  setArticleToDelete: (item: ContentItem) => void;
  setEditingItem: (item: ContentItem) => void;
  setIsEditDialogOpen: (open: boolean) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  setArticleToDelete,
  setEditingItem,
  setIsEditDialogOpen,
}) => {
  const dateValue = item.updatedAt ?? item.createdAt ?? new Date().toISOString();

  const Icon =
    item.type === 'article'
      ? FileText
      : item.type === 'project'
      ? Image
      : Upload;

  return (
    <Card className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* IMAGE */}
      <div className="relative">
        {(item.imageUrl || item.image) ? (
          <div className="aspect-[16/10] overflow-hidden bg-gray-100">
            <img
              src={item.imageUrl || item.image}
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                e.currentTarget.src =
                  'https://via.placeholder.com/400x250?text=No+Image';
              }}
            />

            {/* overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        ) : (
          <div className="aspect-[16/10] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-center">
              <Icon className="mx-auto mb-2 h-10 w-10 text-gray-400" />
              <p className="text-xs text-gray-500">Aucune image</p>
            </div>
          </div>
        )}

        {/* ACTIONS */}
        <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-xl bg-white/90 shadow-sm hover:bg-white"
            onClick={() => setArticleToDelete(item)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>

          {item.type !== 'resource' && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl bg-white/90 shadow-sm hover:bg-white"
              onClick={() => {
                setEditingItem(item);
                setIsEditDialogOpen(true);
              }}
            >
              <Edit className="h-4 w-4 text-blue-500" />
            </Button>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <CardHeader className="space-y-2 p-4">
        <CardTitle className="line-clamp-2 text-base font-semibold text-gray-900">
          {item.title}
        </CardTitle>

        <CardDescription className="line-clamp-2 text-sm text-gray-500">
          {item.description}
        </CardDescription>
      </CardHeader>

      {/* FOOTER */}
      <CardContent className="px-4 pb-4 pt-0">

        {/* META ROW */}
        <div className="flex flex-wrap items-center gap-2 text-xs">

          {/* DATE */}
          <span className="flex items-center gap-1 text-gray-500">
            <Calendar className="h-3.5 w-3.5 text-[#1A535C]" />

            {new Date(dateValue).toLocaleString('fr-FR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>

          {/* LANGUAGE */}
          {item.language && (
            <span className="rounded-full bg-yellow-50 px-2 py-1 text-yellow-700">
              {item.language}
            </span>
          )}

          {/* TYPE TAGS */}
          {item.type === 'resource' && (
            <>
              <span className="rounded-full bg-blue-50 px-2 py-1 text-blue-700">
                {item.category}
              </span>

              <span className="rounded-full bg-green-50 px-2 py-1 text-green-700">
                {item.fileType}
              </span>
            </>
          )}

          {item.type === 'project' && (
            <>
              <span className="rounded-full bg-purple-50 px-2 py-1 text-purple-700">
                {item.country}
              </span>

              {item.subTitle && (
                <span className="text-gray-500">{item.subTitle}</span>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemCard;