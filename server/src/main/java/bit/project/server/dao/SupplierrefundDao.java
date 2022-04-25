package bit.project.server.dao;

import org.springframework.data.domain.Page;
import bit.project.server.entity.Supplierrefund;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(exported=false)
public interface SupplierrefundDao extends JpaRepository<Supplierrefund, Integer>{
    @Query("select new Supplierrefund (s.id,s.code,s.purchase,s.chequeno,s.chequebank) from Supplierrefund s")
    Page<Supplierrefund> findAllBasic(PageRequest pageRequest);

    Supplierrefund findByCode(String code);
}