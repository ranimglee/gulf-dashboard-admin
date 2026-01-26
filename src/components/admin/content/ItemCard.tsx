import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, FileText, Image, Upload, Trash2, Edit } from 'lucide-react';
import { ContentItem } from '../../../types/types';

interface ItemCardProps {
  item: ContentItem;
  setArticleToDelete: (item: ContentItem) => void;
  setEditingItem: (item: ContentItem) => void;
  setIsEditDialogOpen: (open: boolean) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, setArticleToDelete, setEditingItem, setIsEditDialogOpen }) => {
const dateValue =
  item.updatedAt ??
  item.createdAt ??
  new Date().toISOString();

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative">
        {(item.imageUrl || item.image) ? (
          <div className="aspect-[16/10] relative overflow-hidden">
            <img
              src={item.imageUrl || item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/400x250?text=No+Image';
              }}
            />
            {/* Action buttons on top of image */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-2 right-2 flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                onClick={() => setArticleToDelete(item)}
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
              {/* ✅ Keep edit only for non-resource types */}
              {item.type !== 'resource' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                  onClick={() => {
                    setEditingItem(item);
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4 text-blue-600" />
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
            <div className="text-center">
              {item.type === 'article' && <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />}
              {item.type === 'project' && <Image className="w-12 h-12 text-gray-400 mx-auto mb-2" />}
              {item.type === 'resource' && <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />}
              <p className="text-gray-500 text-sm">Aucune image</p>
            </div>
            {/* ✅ If resource: only Trash, else Trash + Edit */}
            <div className="absolute top-2 right-2 flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                onClick={() => setArticleToDelete(item)}
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
              {item.type !== 'resource' && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                  onClick={() => {
                    setEditingItem(item);
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4 text-blue-600" />
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      <CardHeader className="p-4">
        <CardTitle className="text-lg line-clamp-2">{item.title}</CardTitle>
        <CardDescription className="text-sm line-clamp-3 mt-2">
          {item.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <div className="flex flex-wrap gap-2 text-sm">
        <span className="flex items-center text-gray-600">
  <Calendar className="w-3 h-3 mr-1" />
 
  {dateValue
    ? new Date(dateValue).toLocaleString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—'}
</span>


           {/* Language for all types if available */}
    {item.language && (
      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
        {item.language}
      </span>
    )}

          {item.type === 'resource' && (
            <>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                {item.category}
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                {item.fileType}
              </span>
            </>
          )}
          {item.type === 'project' && (
            <>
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                {item.country}
              </span>
              <span className="text-gray-600 text-xs">
                {item.subTitle}
              </span>
            </>
          )}
         
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemCard;
