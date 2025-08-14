import { ProductEntity } from '../entities/product.entity';

export abstract class ProductRepository {
  abstract findByName(name: string): Promise<ProductEntity | null>;

  abstract create(data: {
    name: string;
    description: string;
    price: number;
    createdAt: Date;
  }): Promise<ProductEntity>;
}
